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
     * @ngdoc controller
     * @name selv-requisition-approval-list:SelvRequisitionApprovalListController
     *
     * @description
     * Controller for SELV approval list of requisitions.
     */

    angular
        .module('selv-requisition-approval-list')
        .controller('SelvRequisitionApprovalListController', controller);

    controller.$inject = ['$state', 'requisitions', 'alertService', 'localStorageFactory'];

    function controller($state, requisitions, alertService, localStorageFactory) {

        var vm = this,
            offlineRequisitions = localStorageFactory('requisitions');

        vm.$onInit = onInit;
        vm.openRnr = openRnr;
        vm.toggleSelectAll = toggleSelectAll;
        vm.viewSelectedRequisitions = viewSelectedRequisitions;
        vm.isFullRequisitionAvailable = isFullRequisitionAvailable;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-approval-list:SelvRequisitionApprovalListController
         * @name requisitions
         * @type {Array}
         *
         * @description
         * Holds requisition that will be displayed on screen.
         */
        vm.requisitions = undefined;

        /**
         * @ngdoc method
         * @methodOf selv-requisition-approval-list:SelvRequisitionApprovalListController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.requisitions = requisitions;
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-approval-list:SelvRequisitionApprovalListController
         * @name openRnr
         *
         * @description
         * Redirects to requisition page with given requisition UUID.
         */
        function openRnr(requisitionId) {
            $state.go('openlmis.requisitions.requisition.fullSupply', {
                rnr: requisitionId
            });
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-approval-list:SelvRequisitionApprovalListController
         * @name toggleSelectAll
         *
         * @description
         * Responsible for marking/unmarking all requisitions as selected.
         *
         * @param {boolean} selectAll Determines if all requisitions should be selected or not
         */
        function toggleSelectAll(selectAll) {
            angular.forEach(vm.requisitions, function(requisition) {
                requisition.$selected = selectAll;
            });
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-approval-list:SelvRequisitionApprovalListController
         * @name viewSelectedRequisitions
         *
         * @description
         * Redirects to page for modifying all selected requisitions.
         */
        function viewSelectedRequisitions() {
            var selectedRequisitionIds = [],
                requisitionsFromOneProgram = true,
                requiredProgramId;

            vm.requisitions.forEach(function(requisition) {
                if (requisition.$selected) {
                    if (requiredProgramId && requisition.program.id !== requiredProgramId) {
                        requisitionsFromOneProgram = false;
                    }
                    selectedRequisitionIds.push(requisition.id);
                    requiredProgramId = requisition.program.id;
                }
            });

            if (selectedRequisitionIds.length > 0 && requisitionsFromOneProgram) {
                $state.go('openlmis.requisitions.batchApproval', {
                    ids: selectedRequisitionIds.join(',')
                });
            } else if (requisitionsFromOneProgram) {
                alertService.error('requisitionApproval.selectAtLeastOneRnr');
            } else {
                alertService.error('requisitionApproval.selectRequisitionsFromTheSameProgram');
            }
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-approval-list:SelvRequisitionApprovalListController
         * @name isFullRequisitionAvailable
         *
         * @description
         * Responsible for checking if local storage contains the given requisition.
         *
         * @param {Boolean} requisitionId Requisition that will be searched in storage
         */
        function isFullRequisitionAvailable(requisitionId) {
            var offlineRequisition = offlineRequisitions.search({
                id: requisitionId
            });
            return !vm.offline || vm.offline && offlineRequisition.length > 0;
        }
    }

})();
