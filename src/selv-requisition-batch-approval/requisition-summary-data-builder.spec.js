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
        .factory('RequisitionSummaryDataBuilder', RequisitionSummaryDataBuilder);

    RequisitionSummaryDataBuilder.$inject = ['RequisitionSummaryLineItemDataBuilder'];

    function RequisitionSummaryDataBuilder(RequisitionSummaryLineItemDataBuilder) {

        RequisitionSummaryDataBuilder.prototype.build = build;
        RequisitionSummaryDataBuilder.prototype.withZones = withZones;

        return RequisitionSummaryDataBuilder;

        function RequisitionSummaryDataBuilder() {
            this.zones = ['test'];
        }

        function withZones(zones) {
            this.zones = zones;
            return this;
        }

        function build() {
            return {
                lineItems: [
                    new RequisitionSummaryLineItemDataBuilder()
                        .withZones(this.zones)
                        .build(),
                    new RequisitionSummaryLineItemDataBuilder()
                        .withZones(this.zones)
                        .build(),
                    new RequisitionSummaryLineItemDataBuilder()
                        .withZones(this.zones)
                        .build()
                ],
                districts: this.zones
            };
        }

    }

})();
