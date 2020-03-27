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

describe('RequisitionSummaryResource', function() {

    beforeEach(function() {
        module('selv-requisition-batch-approval');

        inject(function($injector) {
            this.$resource = $injector.get('$resource');
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            this.RequisitionSummaryResource = $injector.get('RequisitionSummaryResource');
        });
    });

    it('should call /api/requisitionSummaries', function() {
        var programId = 'program-id',
            periodId = 'period-id',
            mockedResponse = {
                field: 'test'
            },
            result;

        this.$httpBackend.expectGET(
            this.openlmisUrlFactory('/api/requisitionSummaries?processingPeriodId=period-id&programId=program-id')
        ).respond(200, mockedResponse);

        new this.RequisitionSummaryResource().query(programId, periodId)
            .then(function(response) {
                result = response;
            });

        this.$httpBackend.flush();
        this.$rootScope.$apply();

        expect(result.field).toEqual('test');
    });
});