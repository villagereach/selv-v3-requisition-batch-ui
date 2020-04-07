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

describe('SelvRequisitionBatchApprovalController', function() {

    beforeEach(function() {

        module('selv-requisition-batch-approval');

        inject(function($injector) {
            this.RequisitionSummaryDataBuilder = $injector.get('RequisitionSummaryDataBuilder');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            this.PeriodDataBuilder = $injector.get('PeriodDataBuilder');

            this.requisitionBatchApprovalService = $injector.get('requisitionBatchApprovalService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
        });

        spyOn(this.loadingModalService, 'open').andReturn(this.$q.when());
        spyOn(this.loadingModalService, 'close');
        spyOn(this.requisitionBatchApprovalService, 'approveAll').andReturn(this.$q.when());
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];
        this.processingPeriods = [
            new this.PeriodDataBuilder().build(),
            new this.PeriodDataBuilder().build()
        ];
        this.districts = ['zone1', 'zone2', 'zone3'];
        this.requisitionSummary = new this.RequisitionSummaryDataBuilder()
            .withDistricts(this.districts)
            .build();
        this.$stateParams = {
            programId: this.programs[0].id,
            processingPeriodId: this.processingPeriods[0].id
        };

        spyOn(this.$state, 'go');
    });

    describe('$onInit', function() {

        it('should display expose programs', function() {
            initController(this);

            expect(this.vm.programs).toBe(this.programs);
        });

        it('should select program if programId is set in params', function() {
            initController(this);

            expect(this.vm.selectedProgram).toBe(this.programs[0]);
        });

        it('should not set program if param is not present', function() {
            this.$stateParams.programId = undefined;
            initController(this);

            expect(this.vm.selectedProgram).not.toBeDefined();
        });

        it('should display expose processing periods', function() {
            initController(this);

            expect(this.vm.processingPeriods).toBe(this.processingPeriods);
        });

        it('should select processing period if processingPeriodId is set in params', function() {
            initController(this);

            expect(this.vm.selectedProcessingPeriod).toBe(this.processingPeriods[0]);
        });

        it('should not set processing period if param is not present', function() {
            this.$stateParams.processingPeriodId = undefined;
            initController(this);

            expect(this.vm.selectedProcessingPeriod).not.toBeDefined();
        });

        it('should expose requisitionSummary', function() {
            initController(this);

            expect(this.vm.requisitionSummary).toBe(this.requisitionSummary);
        });

        it('should expose district list', function() {
            initController(this);

            expect(this.vm.districts).toEqual(this.districts);
        });

        it('should not expose district list if requisitionSummary is not set', function() {
            this.requisitionSummary = undefined;
            initController(this);

            expect(this.vm.districts).not.toBeDefined();
        });
    });

    describe('search', function() {

        beforeEach(function() {
            initController(this);
        });

        it('should reload state with proper parameters', function() {
            this.vm.selectedProgram = this.programs[1];
            this.vm.selectedProcessingPeriod = this.processingPeriods[1];
            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.requisitions.approvalSummary', {
                programId: this.programs[1].id,
                processingPeriodId: this.processingPeriods[1].id
            }, {
                reload: true
            });
        });

        it('should reload state without parameters', function() {
            this.vm.selectedProgram = null;
            this.vm.selectedProcessingPeriod = null;
            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.requisitions.approvalSummary', {
                programId: null,
                processingPeriodId: null
            }, {
                reload: true
            });
        });
    });

    describe('edit', function() {

        it('should go to approval list view with proper parameters', function() {
            initController(this);

            this.vm.edit(this.districts[0]);

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.requisitions.approvalList', {
                programId: this.requisitionSummary.program.id,
                processingPeriodId: this.requisitionSummary.processingPeriod.id,
                supervisoryNodeId: this.requisitionSummary.getSupervisoryNodesIds(this.districts[0])
            });
        });
    });

    describe('approveAll', function() {

        beforeEach(function() {
            initController(this);
        });

        it('should call requisitionBatchApprovalService', function() {
            this.vm.approveAll();

            expect(this.requisitionBatchApprovalService.approveAll)
                .toHaveBeenCalledWith(this.vm.requisitionSummary.getRequisitionIds());
        });

        it('should open loading modal', function() {
            this.vm.approveAll();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show success notification', function() {
            this.vm.approveAll();

            this.$rootScope.$apply();

            expect(this.notificationService.success)
                .toHaveBeenCalledWith('selvRequisitionBatchApproval.approveSuccess');
        });

        it('should reload state with current state params', function() {
            this.selectedProgram = this.programs[1];
            this.selectedProcessingPeriod = this.processingPeriods[1];
            this.vm.approveAll();

            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.requisitions.approvalSummary', {
                programId: this.programs[0].id,
                processingPeriodId: this.processingPeriods[0].id
            }, {
                reload: true
            });
        });

        it('should close loading modal when request fails', function() {
            this.requisitionBatchApprovalService.approveAll.andReturn(this.$q.reject());
            this.vm.approveAll();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should show failure notification modal when request fails', function() {
            this.requisitionBatchApprovalService.approveAll.andReturn(this.$q.reject());
            this.vm.approveAll();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('selvRequisitionBatchApproval.approveFailure');
        });
    });

    describe('approve', function() {

        beforeEach(function() {
            initController(this);
        });

        it('should call requisitionBatchApprovalService', function() {
            this.vm.approve(this.districts[0]);

            expect(this.requisitionBatchApprovalService.approveAll)
                .toHaveBeenCalledWith(this.vm.requisitionSummary.getRequisitionIds(this.districts[0]));
        });

        it('should open loading modal', function() {
            this.vm.approve(this.districts[0]);

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show success notification', function() {
            this.vm.approve(this.districts[0]);
            this.$rootScope.$apply();

            expect(this.notificationService.success)
                .toHaveBeenCalledWith('selvRequisitionBatchApproval.approveSuccess');
        });

        it('should reload state with current state params', function() {
            this.selectedProgram = this.programs[1];
            this.selectedProcessingPeriod = this.processingPeriods[1];
            this.vm.approve(this.districts[0]);
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('openlmis.requisitions.approvalSummary', {
                programId: this.programs[0].id,
                processingPeriodId: this.processingPeriods[0].id
            }, {
                reload: true
            });
        });

        it('should close loading modal when request fails', function() {
            this.requisitionBatchApprovalService.approveAll.andReturn(this.$q.reject());
            this.vm.approve(this.districts[0]);
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
        });

        it('should show failure notification when request fails', function() {
            this.requisitionBatchApprovalService.approveAll.andReturn(this.$q.reject());
            this.vm.approve(this.districts[0]);
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith('selvRequisitionBatchApproval.approveFailure');
        });
    });

    function initController(context) {
        context.vm = context.$controller('SelvRequisitionBatchApprovalController', {
            $state: context.$state,
            requisitionSummary: context.requisitionSummary,
            $stateParams: context.$stateParams,
            programs: context.programs,
            processingPeriods: context.processingPeriods
        });
        context.vm.$onInit();
    }
});