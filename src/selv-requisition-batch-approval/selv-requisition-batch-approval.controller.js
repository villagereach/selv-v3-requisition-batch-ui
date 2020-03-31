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
     * @name selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
     *
     * @description
     * Controller for batch approval for districts.
     */

    angular
        .module('selv-requisition-batch-approval')
        .controller('SelvRequisitionBatchApprovalController', controller);

    controller.$inject = ['$state', 'requisitionSummary', '$stateParams', 'programs', 'processingPeriods'];

    function controller($state, requisitionSummary, $stateParams, programs, processingPeriods) {

        var vm = this;

        vm.$onInit = onInit;
        vm.search = search;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name requisitionSummary
         * @type {Object}
         *
         * @description
         * Holds requisition summary.
         */
        vm.requisitionSummary = undefined;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name programs
         * @type {Array}
         *
         * @description
         * List of programs to which user has access based on his role/permissions.
         */
        vm.programs = undefined;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name selectedProgram
         * @type {Object}
         *
         * @description
         * The program selected by the user.
         */
        vm.selectedProgram = undefined;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name processingPeriods
         * @type {Array}
         *
         * @description
         * List of processing periods.
         */
        vm.processingPeriods = undefined;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name selectedProcessingPeriod
         * @type {Object}
         *
         * @description
         * The processing period selected by the user.
         */
        vm.selectedProcessingPeriod = undefined;

        /**
         * @ngdoc property
         * @propertyOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name processingPeriods
         * @type {Array}
         *
         * @description
         * List of districts that are in the requisition summary.
         */
        vm.districts = undefined;

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name $onInit
         *
         * @description
         * Initialization method called after the controller has been created. Responsible for
         * setting data to be available on the view.
         */
        function onInit() {
            vm.programs = programs;
            vm.processingPeriods = processingPeriods;
            vm.requisitionSummary = requisitionSummary;

            if ($stateParams.programId) {
                vm.selectedProgram = vm.programs.filter(function(program) {
                    return program.id === $stateParams.programId;
                })[0];
            }

            if ($stateParams.processingPeriodId) {
                vm.selectedProcessingPeriod = vm.processingPeriods.filter(function(processingPeriod) {
                    return processingPeriod.id === $stateParams.processingPeriodId;
                })[0];
            }

            if (vm.requisitionSummary) {
                vm.districts = requisitionSummary.districts;
            }
        }

        /**
         * @ngdoc method
         * @methodOf selv-requisition-batch-approval.controller:SelvRequisitionBatchApprovalController
         * @name search
         *
         * @description
         * Reloads the page with selected parameters: processingPeriodId and programId.
         */
        function search() {
            var stateParams = angular.copy($stateParams);

            stateParams.programId = vm.selectedProgram ? vm.selectedProgram.id : null;
            stateParams.processingPeriodId = vm.selectedProcessingPeriod ? vm.selectedProcessingPeriod.id : null;

            $state.go('openlmis.requisitions.approvalSummary', stateParams, {
                reload: true
            });
        }
    }
})();