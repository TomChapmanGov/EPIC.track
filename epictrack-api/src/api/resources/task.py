# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Resource for Task endpoints."""
from http import HTTPStatus

from flask import jsonify, request
from flask_restx import Namespace, Resource, cors
from api.schemas import request as req
from api.schemas import response as res
from api.services import TaskService
from api.utils import auth, profiletime
from api.utils.util import cors_preflight

API = Namespace("tasks", description="Tasks")


@cors_preflight("GET,POST,PATCH,DELETE")
@API.route("/events", methods=["GET", "DELETE", "POST", "PATCH", "OPTIONS"])
class Events(Resource):
    """Endpoint resource to return all task events for given work id and phase id"""

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def get():
        """Return all task templates."""
        args = req.TaskEventQueryParamSchema().load(request.args)
        work_phase_id = args.get("work_phase_id")
        task_events = TaskService.find_task_events(work_phase_id)
        return (
            jsonify(res.TaskEventResponseSchema(many=True).dump(task_events)),
            HTTPStatus.OK,
        )

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def post():
        """Create a new Task Event"""
        request_json = req.TaskEventBodyParamSchema().load(API.payload)
        task_response = TaskService.create_task_event(request_json)
        return res.TaskEventResponseSchema().dump(task_response), HTTPStatus.CREATED

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def patch():
        """Bulk update tasks."""
        request_json = req.TaskEventBulkUpdateBodyParamSchema(partial=True).load(API.payload)
        result = TaskService.bulk_update(request_json)
        return result, HTTPStatus.OK

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def delete():
        """Delete tasks."""
        request_json = req.TasksBulkDeleteQueryParamSchema().load(request.args)
        result = TaskService.bulk_delete_tasks(request_json["task_ids"])
        return result, HTTPStatus.OK


@cors_preflight("GET,PUT")
@API.route("/events/<int:event_id>", methods=["GET", "PUT", "OPTIONS"])
class Event(Resource):
    """Endpoint resource to handle single TaskEvent"""

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def put(event_id):
        """Create a new Task Event"""
        request_json = req.TaskEventBodyParamSchema().load(API.payload)
        task_response = TaskService.update_task_event(request_json, event_id)
        return res.TaskEventResponseSchema().dump(task_response), HTTPStatus.OK

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def get(event_id):
        """Gets the task event"""
        req.TaskEventIdPathParameterSchema().load(request.view_args)
        task_event = TaskService.find_task_event(event_id)
        return res.TaskEventResponseSchema().dump(task_event), HTTPStatus.OK


@cors_preflight("POST")
@API.route("/templates/<int:template_id>/events", methods=["POST", "OPTIONS"])
class TemplateEvents(Resource):
    """Endpoint resource to return all task events for given work id and phase id"""

    @staticmethod
    @cors.crossdomain(origin="*")
    @auth.require
    @profiletime
    def post(template_id: int):
        """Return all task templates."""
        request_json = req.TaskTemplateImportEventsBodyParamSchema().load(API.payload)
        task_events = TaskService.create_task_events_from_template(request_json, template_id)
        return (
            jsonify(res.TaskEventResponseSchema(many=True).dump(task_events)),
            HTTPStatus.CREATED,
        )
