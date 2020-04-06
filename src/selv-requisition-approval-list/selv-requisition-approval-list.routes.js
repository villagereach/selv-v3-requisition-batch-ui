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
        .module('selv-requisition-approval-list')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('openlmis.requisitions.approvalList', {
            showInNavigation: false,
            isOffline: false,
            label: 'selvRequisitionApprovalPage.approve',
            url: '/selvApprovalList?programId&processingPeriodId&supervisoryNodeId',
            controller: 'SelvRequisitionApprovalListController',
            controllerAs: 'vm',
            templateUrl: 'selv-requisition-approval-list/selv-requisition-approval-list.html',
            canAccess: function(permissionService, REQUISITION_RIGHTS) {
                return permissionService.hasRoleWithRightAndFacility(REQUISITION_RIGHTS.REQUISITION_APPROVE);
            },
            resolve: {
                requisitions: function(paginationService, selvRequisitionApprovalService, $stateParams) {
                    return paginationService.registerList(undefined, $stateParams, function(stateParams) {
                        return selvRequisitionApprovalService.getRequisitionsForApproval(
                            stateParams.programId,
                            stateParams.processingPeriodId,
                            Array.isArray(stateParams.supervisoryNodeId) ?
                                stateParams.supervisoryNodeId : [stateParams.supervisoryNodeId]
                        );
                    }, {
                        paginationId: 'selvApprovalList'
                    });
                }
            }
        });
    }

})();
