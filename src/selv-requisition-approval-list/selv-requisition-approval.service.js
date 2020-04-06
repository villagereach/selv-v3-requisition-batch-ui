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
     * @name selv-requisition-approval-list.selvRequisitionApprovalService
     *
     * @description
     * Provides getting requisitions for SELV approval list page.
     */
    angular
        .module('selv-requisition-approval-list')
        .service('selvRequisitionApprovalService', service);

    service.$inject = ['$q', 'requisitionService', 'REQUISITION_STATUS'];

    function service($q, requisitionService, REQUISITION_STATUS) {

        this.getRequisitionsForApproval = getRequisitionsForApproval;

        /**
         * @ngdoc method
         * @methodOf selv-requisition-approval-list.selvRequisitionApprovalService
         * @name getRequisitionsForApproval
         *
         * @description
         * Gets requisitions for approval based on given params.
         * 
         * @param  {string}  programId          given program id
         * @param  {string}  processingPeriodId given period id
         * @param  {Array}   supervisoryNodeIds list of supervisory node ids
         * @return {Promise}                    requisitions ready for approval
         */
        function getRequisitionsForApproval(programId, processingPeriodId, supervisoryNodeIds) {
            var promises = supervisoryNodeIds.map(function(supervisoryNodeId) {
                return requisitionService.search(false, {
                    requisitionStatus: [
                        REQUISITION_STATUS.AUTHORIZED,
                        REQUISITION_STATUS.IN_APPROVAL
                    ],
                    program: programId,
                    processingPeriod: processingPeriodId,
                    supervisoryNode: supervisoryNodeId
                });
            });

            return $q.all(promises)
                .then(function(responses) {
                    return responses.flatMap(function(requisitionPage) {
                        return requisitionPage.content;
                    });
                });
        }
    }
})();
