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

    RequisitionSummaryDataBuilder.$inject = [
        'RequisitionSummaryLineItemDataBuilder', 'RequisitionSummary', 'OrderableDataBuilder'
    ];

    function RequisitionSummaryDataBuilder(
        RequisitionSummaryLineItemDataBuilder, RequisitionSummary, OrderableDataBuilder
    ) {

        RequisitionSummaryDataBuilder.prototype.buildJson = buildJson;
        RequisitionSummaryDataBuilder.prototype.build = build;
        RequisitionSummaryDataBuilder.prototype.withDistricts = withDistricts;
        RequisitionSummaryDataBuilder.prototype.withOrderables = withOrderables;

        return RequisitionSummaryDataBuilder;

        function RequisitionSummaryDataBuilder() {
            this.districts = ['district1'];
            this.orderables = [new OrderableDataBuilder().buildJson()];
            this.program = {
                id: 'program-id'
            };
            this.processingPeriod = {
                id: 'period-id'
            };
        }

        function withDistricts(districts) {
            this.districts = districts;
            return this;
        }

        function withOrderables(orderables) {
            this.orderables = orderables;
            return this;
        }

        function buildJson() {
            var builder = this;
            var orderablesMap = builder.orderables.reduce(function(result, orderable) {
                if (!result[orderable.id]) {
                    result[orderable.id] = [];
                }
                result[orderable.id].push(orderable.meta.versionNumber);
                return result;
            }, {});
            return {
                program: builder.program,
                processingPeriod: builder.processingPeriod,
                lineItems: Object.keys(orderablesMap).map(function(orderableId) {
                    return new RequisitionSummaryLineItemDataBuilder()
                        .withOrderableId(orderableId)
                        .withDistrictsAndVersions(builder.districts.reduce(function(result, district) {
                            result[district] = orderablesMap[orderableId];
                            return result;
                        }, {}))
                        .build();
                }),
                districtRequisitionIds: builder.districts.reduce(function(result, district) {
                    result[district] = ['requisition-id-' + district];
                    return result;
                }, {}),
                districtSupervisoryNodeIds: builder.districts.reduce(function(result, district) {
                    result[district] = ['supervisory-node-id-' + district];
                    return result;
                }, {})
            };
        }

        function build() {
            return new RequisitionSummary(this.buildJson(), this.orderables);
        }
    }
})();
