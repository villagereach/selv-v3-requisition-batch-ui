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

            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
            this.$controller = $injector.get('$controller');
        });

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];
        this.processingPeriods = [
            new this.PeriodDataBuilder().build(),
            new this.PeriodDataBuilder().build()
        ];
        this.zones = ['zone1', 'zone2', 'zone3'];
        this.requisitionSummary = new this.RequisitionSummaryDataBuilder()
            .withZones(this.zones)
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

            expect(this.vm.districts).toEqual(this.zones);
        });

        it('should not expose district list if requisitionSummary is not set', function() {
            this.requisitionSummary = undefined;
            initController(this);

            expect(this.vm.districts).not.toBeDefined();
        });
    });

    describe('search', function() {

        it('should reload state with proper parameters', function() {
            initController(this);
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
            initController(this);
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