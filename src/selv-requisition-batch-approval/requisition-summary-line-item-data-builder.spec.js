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
        .factory('RequisitionSummaryLineItemDataBuilder', RequisitionSummaryLineItemDataBuilder);

    RequisitionSummaryLineItemDataBuilder.$inject = ['OrderableDataBuilder'];

    function RequisitionSummaryLineItemDataBuilder(OrderableDataBuilder) {

        RequisitionSummaryLineItemDataBuilder.prototype.build = build;
        RequisitionSummaryLineItemDataBuilder.prototype.withZones = withZones;

        return RequisitionSummaryLineItemDataBuilder;

        function RequisitionSummaryLineItemDataBuilder() {
            this.zones = ['test'];
            this.orderable = new OrderableDataBuilder().buildJson();
            this.stockOnHand = getRandomInt(100);
            this.requestedQuantity = getRandomInt(100);
            this.packsToShip = getRandomInt(100);
            this.cost = getRandomInt(100);
        }

        function withZones(zones) {
            this.zones = zones;
            return this;
        }

        function build() {
            var zoneSummaries = this.zones.reduce(function(result, zoneName) {
                result[zoneName] = {
                    districtName: zoneName,
                    stockOnHand: getRandomInt(100),
                    requestedQuantity: getRandomInt(100),
                    packsToShip: getRandomInt(100),
                    cost: getRandomInt(100)
                };
                return result;
            }, {});

            return {
                zoneSummaries: zoneSummaries,
                stockOnHand: this.stockOnHand,
                requestedQuantity: this.requestedQuantity,
                packsToShip: this.packsToShip,
                cost: this.cost
            };
        }

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    }

})();
