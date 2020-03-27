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
     * @name selv-requisition-batch-approval.RequisitionSummaryResource
     *
     * @description
     * Communicates with the /api/programs endpoint of the OpenLMIS server.
     */
    angular
        .module('selv-requisition-batch-approval')
        .factory('RequisitionSummaryResource', RequisitionSummaryResource);

    RequisitionSummaryResource.$inject = ['openlmisUrlFactory', '$resource'];

    function RequisitionSummaryResource(openlmisUrlFactory, $resource) {

        RequisitionSummaryResource.prototype.query = query;

        return RequisitionSummaryResource;

        function RequisitionSummaryResource() {
            this.resource = $resource(openlmisUrlFactory('/api/requisitionSummaries'), {}, {
                query: {
                    isArray: false
                }
            });
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.RequisitionSummaryResource
         * @name query
         * 
         * @description
         * Gets requisition summary aggregated by districts by program and processing period.
         * 
         * @param   {string}  programId          given program id 
         * @param   {string}  processingPeriodId given period id
         * @returns {Promise}                    requisition summary for given period and program
         */
        function query(programId, processingPeriodId) {
            return this.resource.query({
                programId: programId,
                processingPeriodId: processingPeriodId
            }).$promise;
        }
    }
})();