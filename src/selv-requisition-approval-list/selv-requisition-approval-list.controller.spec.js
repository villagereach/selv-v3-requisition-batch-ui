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

describe('SelvRequisitionApprovalListController', function() {

    //injects
    var vm, $state, alertService, $controller, requisitionsStorage, batchRequisitionsStorage;

    //variables
    var requisitions;

    beforeEach(function() {
        module('selv-requisition-approval-list');

        module(function($provide) {
            requisitionsStorage = jasmine.createSpyObj('requisitionsStorage', ['search', 'put', 'getBy', 'removeBy']);
            batchRequisitionsStorage = jasmine.createSpyObj('batchRequisitionsStorage', ['search', 'put', 'getBy',
                'removeBy']);

            var offlineFlag = jasmine.createSpyObj('offlineRequisitions', ['getAll']);
            offlineFlag.getAll.andReturn([false]);
            var localStorageFactorySpy = jasmine.createSpy('localStorageFactory').andCallFake(function(resourceName) {
                if (resourceName === 'offlineFlag') {
                    return offlineFlag;
                }
                if (resourceName === 'batchApproveRequisitions') {
                    return batchRequisitionsStorage;
                }
                return requisitionsStorage;
            });

            $provide.service('localStorageFactory', function() {
                return localStorageFactorySpy;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            alertService = $injector.get('alertService');
        });

        requisitions = [
            {
                id: 1,
                facility: {
                    id: '1',
                    name: 'first facility',
                    code: 'first code'
                },
                program: {
                    id: '1'
                }

            },
            {
                id: 2,
                facility: {
                    id: '2',
                    name: 'second facility',
                    code: 'second code'
                },
                program: {
                    id: '2'
                }

            }
        ];
    });

    describe('$onInit', function() {

        beforeEach(function() {
            initController();
        });

        it('should expose requisitions', function() {
            vm.$onInit();

            expect(vm.requisitions).toBe(requisitions);
        });
    });

    describe('openRnr', function() {

        beforeEach(function() {
            initController();

            spyOn($state, 'go');
        });

        it('should go to fullSupply state', function() {
            vm.openRnr(requisitions[0].id);

            expect($state.go).toHaveBeenCalledWith('openlmis.requisitions.requisition.fullSupply', {
                rnr: requisitions[0].id
            });
        });
    });

    describe('viewSelectedRequisitions', function() {

        beforeEach(function() {
            initController();

            spyOn($state, 'go');
            spyOn(alertService, 'error');
        });

        it('should show error when trying to call with no requisition selected', function() {
            vm.viewSelectedRequisitions();

            expect($state.go).not.toHaveBeenCalled();
            expect(alertService.error).toHaveBeenCalledWith('requisitionApproval.selectAtLeastOneRnr');
        });

        it('should show error when trying to call with requisition selected from two different programs', function() {
            vm.selectedProgram = undefined;
            vm.requisitions[0].$selected = true;
            vm.requisitions[1].$selected = true;

            vm.viewSelectedRequisitions();

            expect($state.go).not.toHaveBeenCalled();
            expect(alertService.error).toHaveBeenCalledWith('requisitionApproval.selectRequisitionsFromTheSameProgram');
        });

        it('should not show error when trying to call with requisition selected', function() {
            vm.requisitions[0].$selected = true;

            vm.viewSelectedRequisitions();

            expect($state.go).toHaveBeenCalledWith('openlmis.requisitions.batchApproval', {
                ids: [ vm.requisitions[0].id ].join(',')
            });

            expect(alertService.error).not.toHaveBeenCalled();
        });

    });

    function initController() {
        vm = $controller('SelvRequisitionApprovalListController', {
            requisitions: requisitions
        });
        vm.$onInit();
    }
});
