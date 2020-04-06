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

    function RequisitionSummaryLineItemDataBuilder() {

        RequisitionSummaryLineItemDataBuilder.prototype.build = build;
        RequisitionSummaryLineItemDataBuilder.prototype.withDistrictsAndVersions = withDistrictsAndVersions;
        RequisitionSummaryLineItemDataBuilder.prototype.withOrderableId = withOrderableId;

        return RequisitionSummaryLineItemDataBuilder;

        function RequisitionSummaryLineItemDataBuilder() {
            this.districtsWithVersions = {
                district1: ['1']
            };
            this.orderableId = 'orderable-id';
        }

        function withDistrictsAndVersions(districtsWithVersions) {
            this.districtsWithVersions = districtsWithVersions;
            return this;
        }

        function withOrderableId(orderableId) {
            this.orderableId = orderableId;
            return this;
        }

        function build() {
            var builder = this;
            return {
                orderable: {
                    id: builder.orderableId
                },
                districtSummaries: Object.keys(builder.districtsWithVersions).reduce(function(result, districtName) {
                    result[districtName] = {
                        orderableVersions: builder.districtsWithVersions[districtName].map(function(version) {
                            return {
                                versionNumber: version,
                                stockOnHand: getRandomInt(100),
                                requestedQuantity: getRandomInt(100),
                                packsToShip: getRandomInt(100)
                            };
                        })
                    };
                    return result;
                }, {})
            };
        }

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    }
})();
