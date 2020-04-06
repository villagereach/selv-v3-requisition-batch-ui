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

describe('requisitionSummaryService', function() {

    beforeEach(function() {

        var context = this;

        module('selv-requisition-batch-approval', function($provide) {
            context.RequisitionSummaryMock = jasmine.createSpy('RequisitionSummary');

            $provide.factory('RequisitionSummary', function() {
                return context.RequisitionSummaryMock;
            });
        });

        inject(function($injector) {
            this.RequisitionSummaryDataBuilder = $injector.get('RequisitionSummaryDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');

            this.$rootScope = $injector.get('$rootScope');
            this.requisitionSummaryService = $injector.get('requisitionSummaryService');
            this.RequisitionSummaryResource = $injector.get('RequisitionSummaryResource');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$q = $injector.get('$q');
        });

        this.zones = ['zone1', 'zone2', 'zone3'];
        this.orderables = [
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build()
        ];
        this.requisitionSummary = new this.RequisitionSummaryDataBuilder()
            .withDistricts(this.zones)
            .withOrderables(this.orderables)
            .buildJson();

        spyOn(this.RequisitionSummaryResource.prototype, 'query')
            .andReturn(this.$q.resolve(this.requisitionSummary));
        spyOn(this.OrderableResource.prototype, 'getByVersionIdentities')
            .andReturn(this.$q.resolve(this.orderables));
    });

    describe('getRequisitionSummary', function() {

        var programId = 'program-id',
            processingPeriodId = 'period-id';

        beforeEach(function() {
            this.requisitionSummaryService.getRequisitionSummary(programId, processingPeriodId);
            this.$rootScope.$apply();
        });

        it('should call RequisitionSummaryResource with proper parameters', function() {
            expect(this.RequisitionSummaryResource.prototype.query)
                .toHaveBeenCalledWith(programId, processingPeriodId);
        });

        it('should call OrderableResource with identities', function() {
            expect(this.OrderableResource.prototype.getByVersionIdentities)
                .toHaveBeenCalledWith([
                    {
                        versionNumber: this.orderables[0].meta.versionNumber,
                        id: this.orderables[0].id
                    },
                    {
                        versionNumber: this.orderables[1].meta.versionNumber,
                        id: this.orderables[1].id
                    }
                ]);
        });

        it('should build RequisitionSummary object', function() {
            expect(this.RequisitionSummaryMock).toHaveBeenCalledWith(this.requisitionSummary, this.orderables);
        });
    });
});