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
     * @name selv-requisition-batch-approval.RequisitionSummary
     *
     * @description
     * Represents a single RequisitionSummary.
     */
    angular
        .module('selv-requisition-batch-approval')
        .factory('RequisitionSummary', RequisitionSummary);

    function RequisitionSummary() {

        RequisitionSummary.prototype.getRequisitionIds = getRequisitionIds;
        RequisitionSummary.prototype.getSupervisoryNodesIds = getSupervisoryNodesIds;

        return RequisitionSummary;

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.RequisitionSummary
         * @name RequisitionSummary
         *
         * @description
         * Creates a new instance of the RequisitionSummary class.
         *
         * @param {object} requisitionSummary requisition summary retrieved from server
         * @param {Array}  orderables         full representation of all orderables used in requisition summary
         */
        function RequisitionSummary(requisitionSummary, orderables) {
            this.program = requisitionSummary.program;
            this.processingPeriod = requisitionSummary.processingPeriod;
            this.lineItems = requisitionSummary.lineItems;
            this.districtRequisitionIds = requisitionSummary.districtRequisitionIds;
            this.districtSupervisoryNodeIds = requisitionSummary.districtSupervisoryNodeIds;

            setOrderableDetails(this, getOrderablesMap(orderables));
            aggregateRequisitionSummaryData(this);
            setDistrictList(this);
            calculateTotalCosts(this);
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.RequisitionSummary
         * @name getRequisitionIds
         *
         * @description
         * Gets requisition ids from requisition summary based on district name.
         * If district name is null/undefined then all requisition ids from requisition summary will be returned.
         * 
         * @param  {string}  districtName name of a a district
         * @return {Array}                list of unique requisition ids for given district or requisition summary
         */
        function getRequisitionIds(districtName) {
            var requisitionSummary = this;

            if (districtName) {
                return requisitionSummary.districtRequisitionIds[districtName];
            }
            return Array.from(Object.keys(this.districtRequisitionIds).reduce(function(set, districtName) {
                requisitionSummary.districtRequisitionIds[districtName].forEach(function(requisitionId) {
                    set.add(requisitionId);
                });
                return set;
            }, new Set()));
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.RequisitionSummary
         * @name getSupervisoryNodesIds
         *
         * @description
         * Gets supervisory nodes for given district.
         * 
         * @param  {string}  districtName name of a a district
         * @return {Array}                list of unique supervisory nodes ids for given district
         */
        function getSupervisoryNodesIds(districtName) {
            if (districtName) {
                return this.districtSupervisoryNodeIds[districtName];
            }
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

                Object.keys(lineItem.districtSummaries).forEach(function(districtName) {
                    lineItem.districtSummaries[districtName].orderableVersions
                        .forEach(function(orderableVersionSummary) {
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
            requisitionSummary.lineItems.forEach(function(lineItem) {
                lineItem.stockOnHand = 0;
                lineItem.requestedQuantity = 0;
                lineItem.packsToShip = 0;
                lineItem.cost = 0;

                Object.keys(lineItem.districtSummaries).forEach(function(districtName) {
                    var districtSummary = lineItem.districtSummaries[districtName];

                    districtSummary.stockOnHand = 0;
                    districtSummary.requestedQuantity = 0;
                    districtSummary.packsToShip = 0;
                    districtSummary.cost = 0;

                    districtSummary.orderableVersions.forEach(function(orderableVersionSummary) {
                        districtSummary.stockOnHand += orderableVersionSummary.stockOnHand;
                        districtSummary.requestedQuantity += orderableVersionSummary.requestedQuantity;
                        districtSummary.packsToShip += orderableVersionSummary.packsToShip;
                        districtSummary.cost += orderableVersionSummary.packsToShip *
                            orderableVersionSummary.pricePerPack;
                    });

                    lineItem.stockOnHand += districtSummary.stockOnHand;
                    lineItem.requestedQuantity += districtSummary.requestedQuantity;
                    lineItem.packsToShip += districtSummary.packsToShip;
                    lineItem.cost += districtSummary.cost;
                });
            });
        }

        function setDistrictList(requisitionSummary) {
            requisitionSummary.districts = Object.keys(requisitionSummary.districtRequisitionIds);
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
                    var districtSummary = lineItem.districtSummaries[district];

                    if (districtSummary) {
                        sum += districtSummary.cost;
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
