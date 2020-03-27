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

    angular
        .module('selv-requisition-batch-approval')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('openlmis.requisitions.approvalSummary', {
            showInNavigation: true,
            isOffline: true,
            label: 'selvRequisitionBatchApproval.title',
            url: '/batchApprovalList?programId&processingPeriodId',
            controller: 'SelvRequisitionBatchApprovalController',
            controllerAs: 'vm',
            templateUrl: 'selv-requisition-batch-approval/selv-requisition-batch-approval.html',
            canAccess: function(permissionService, REQUISITION_RIGHTS) {
                return permissionService.hasRoleWithRight(REQUISITION_RIGHTS.REQUISITION_APPROVE);
            },
            resolve: {
                requisitionSummary: function(requisitionSummaryService, $stateParams) {
                    if ($stateParams.programId && $stateParams.processingPeriodId) {
                        return requisitionSummaryService
                            .getRequisitionSummary($stateParams.programId, $stateParams.processingPeriodId);
                    }
                },
                programs: function(programService, authorizationService) {
                    return programService.getUserPrograms(authorizationService.getUser().user_id);
                },
                processingPeriods: function(ProcessingPeriodResource, moment) {
                    return new ProcessingPeriodResource().query({
                        endDate: moment().format('YYYY-MM-DD')
                    })
                        .then(function(response) {
                            return response.content;
                        });
                }
            }
        });
    }
})();
