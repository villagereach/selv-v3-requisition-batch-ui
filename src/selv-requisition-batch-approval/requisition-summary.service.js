/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name selv-requisition-batch-approval.requisitionSummaryService
     *
     * @description
     * Builds object ready to be displayed for Batch Approval page from requisition summary retrieved from server.
     * It is using cached orderables to aggregate the data and display proper total prices.
     */
    angular
        .module('selv-requisition-batch-approval')
        .service('requisitionSummaryService', service);

    service.$inject = ['RequisitionSummaryResource', 'OrderableResource'];

    function service(RequisitionSummaryResource, OrderableResource) {

        this.getRequisitionSummary = getRequisitionSummary;

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.requisitionSummaryService
         * @name getRequisitionSummary
         *
         * @description
         * Gets requisition summary from server and adds orderable info using cached resources.
         * 
         * @param  {String}  programId          given program id
         * @param  {Object}  processingPeriodId given period id
         * @return {Promise}                    requisition summary properly aggregated with 
         */
        function getRequisitionSummary(programId, processingPeriodId) {
            return new RequisitionSummaryResource().query(programId, processingPeriodId)
                .then(function(requisitionSummary) {
                    return extendSummaryWithOrderables(requisitionSummary);
                });
        }

        function extendSummaryWithOrderables(requisitionSummary) {
            return new OrderableResource().getByVersionIdentities(getOrderableIdentities(requisitionSummary))
                .then(function(orderables) {
                    var orderablesMap = getOrderablesMap(orderables);
                    setOrderableDetails(requisitionSummary, orderablesMap);
                    return aggregateRequisitionSummaryData(requisitionSummary);
                });
        }

        function getOrderableIdentities(requisitionSummary) {
            return requisitionSummary.lineItems.map(function(lineItem) {
                return lineItem.zoneSummaries.flatMap(function(zoneSummary) {
                    return zoneSummary.orderableVersions;
                })
                    .map(function(orderableVersionSummary) {
                        return {
                            versionNumber: orderableVersionSummary.versionNumber,
                            id: lineItem.orderable.id
                        };
                    });
            })
                .flatMap(function(array) {
                    return array;
                });
        }

        function getOrderablesMap(orderables) {
            return orderables.reduce(function(result, orderable) {
                if (!result[orderable.id]) {
                    result[orderable.id] = {};
                }
                result[orderable.id][orderable.meta.versionNumber] = orderable;
                return result;
            }, {});
        }

        function setOrderableDetails(requisitionSummary, orderablesMap) {
            requisitionSummary.lineItems.forEach(function(lineItem) {
                var orderableVersionMap = orderablesMap[lineItem.orderable.id],
                    newestOrderableVersion = getNewestOrderableVersionNumber(orderableVersionMap),
                    newestOrderable = orderableVersionMap[newestOrderableVersion];

                lineItem.orderable.fullProductName = newestOrderable.fullProductName;
                lineItem.orderable.productCode = newestOrderable.productCode;

                lineItem.zoneSummaries.forEach(function(zoneSummary) {
                    zoneSummary.orderableVersions.forEach(function(orderableVersionSummary) {
                        var orderable = orderableVersionMap[orderableVersionSummary.versionNumber];
                        orderableVersionSummary.pricePerPack =
                            getPricePerPack(orderable, requisitionSummary.program.id);
                    });
                });
            });
        }

        function getNewestOrderableVersionNumber(orderableVersionsMap) {
            var newestVersionNumber = -1;
            for (var property in orderableVersionsMap) {
                if (orderableVersionsMap.hasOwnProperty(property) && parseInt(property, 10) > newestVersionNumber) {
                    newestVersionNumber = parseInt(property, 10);
                }
            }
            return newestVersionNumber;
        }

        function aggregateRequisitionSummaryData(requisitionSummary) {
            var districts = new Set();
            requisitionSummary.lineItems.forEach(function(lineItem) {
                lineItem.stockOnHand = 0;
                lineItem.requestedQuantity = 0;
                lineItem.packsToShip = 0;
                lineItem.cost = 0;

                lineItem.zoneSummaries.forEach(function(zoneSummary) {
                    zoneSummary.stockOnHand = 0;
                    zoneSummary.requestedQuantity = 0;
                    zoneSummary.packsToShip = 0;
                    zoneSummary.cost = 0;

                    zoneSummary.orderableVersions.forEach(function(orderableVersionSummary) {
                        zoneSummary.stockOnHand += orderableVersionSummary.stockOnHand;
                        zoneSummary.requestedQuantity += orderableVersionSummary.requestedQuantity;
                        zoneSummary.packsToShip += orderableVersionSummary.packsToShip;
                        zoneSummary.cost += orderableVersionSummary.packsToShip *
                            orderableVersionSummary.pricePerPack;
                    });

                    lineItem.stockOnHand += zoneSummary.stockOnHand;
                    lineItem.requestedQuantity += zoneSummary.requestedQuantity;
                    lineItem.packsToShip += zoneSummary.packsToShip;
                    lineItem.cost += zoneSummary.cost;
                });

                lineItem.zoneSummaries = lineItem.zoneSummaries.reduce(function(result, zoneSummary) {
                    result[zoneSummary.districtName] = zoneSummary;
                    districts.add(zoneSummary.districtName);
                    return result;
                }, {});
            });

            requisitionSummary.districts = Array.from(districts);
            requisitionSummary.districts.sort();

            calculateTotalCosts(requisitionSummary);

            return requisitionSummary;
        }

        function getPricePerPack(orderable, programId) {
            return orderable.programs.filter(function(programOrderable) {
                return programOrderable.programId === programId;
            }).map(function(programOrderable) {
                return programOrderable.pricePerPack;
            });
        }

        function calculateTotalCosts(requisitionSummary) {
            var totalCost = 0;
            requisitionSummary.districtTotalCosts = requisitionSummary.districts.reduce(function(result, district) {
                result[district] = requisitionSummary.lineItems.reduce(function(sum, lineItem) {
                    var zoneSummary = lineItem.zoneSummaries[district];

                    if (zoneSummary) {
                        sum += zoneSummary.cost;
                    }
                    return sum;
                }, 0);
                totalCost += result[district];
                return result;
            }, {});
            requisitionSummary.totalCost = totalCost;
        }
    }
})();
