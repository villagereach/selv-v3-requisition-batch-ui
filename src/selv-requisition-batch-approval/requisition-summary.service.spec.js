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

        module('selv-requisition-batch-approval');

        inject(function($injector) {
            this.RequisitionSummaryDataBuilder = $injector.get('RequisitionSummaryDataBuilder');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');

            this.$rootScope = $injector.get('$rootScope');
            this.RequisitionSummaryResource = $injector.get('RequisitionSummaryResource');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$q = $injector.get('$q');
        });

        this.zones = ['zone1', 'zone2', 'zone3'];
        this.requisitionSummary = new this.RequisitionSummaryDataBuilder()
            .withZones(this.zones)
            .build();
    });

    describe('getRequisitionSummary', function() {
    });
});