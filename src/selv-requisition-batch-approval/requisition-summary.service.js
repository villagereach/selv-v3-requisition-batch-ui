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
     * Allows getting Requisition Summary from server and builds object ready to display.
     */
    angular
        .module('selv-requisition-batch-approval')
        .service('requisitionSummaryService', service);

    service.$inject = ['RequisitionSummaryResource', 'OrderableResource', 'RequisitionSummary'];

    function service(RequisitionSummaryResource, OrderableResource, RequisitionSummary) {

        this.getRequisitionSummary = getRequisitionSummary;

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.requisitionSummaryService
         * @name getRequisitionSummary
         *
         * @description
         * Gets requisition summary from server and adds orderable info using cached orderables.
         * 
         * @param  {string}  programId          given program id
         * @param  {string}  processingPeriodId given period id
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
                    return new RequisitionSummary(requisitionSummary, orderables);
                });
        }

        function getOrderableIdentities(requisitionSummary) {
            var orderablesMap = requisitionSummary.lineItems.reduce(function(result, lineItem) {
                result[lineItem.orderable.id] = Array.from(Object.keys(lineItem.districtSummaries)
                    .reduce(function(versions, districtName) {
                        lineItem.districtSummaries[districtName].orderableVersions.map(function(orderableVersion) {
                            versions.add(orderableVersion.versionNumber);
                        });
                        return versions;
                    }, new Set()));
                return result;
            }, {});
            var result = Object.keys(orderablesMap).flatMap(function(orderableId) {
                return orderablesMap[orderableId].map(function(versionNumber) {
                    return {
                        versionNumber: versionNumber,
                        id: orderableId
                    };
                });
            });
            return result;
        }
    }
})();
