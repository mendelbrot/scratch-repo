import pprint
import time
from math import inf
import typing
from dataclasses import dataclass


@dataclass(frozen=True)
class Request:
    scope: typing.Mapping[str, typing.Any]

    receive: typing.Callable[[], typing.Awaitable[object]]
    send: typing.Callable[[object], typing.Awaitable[None]]


class RestaurantManager:
    def __init__(self):
        """Instantiate the restaurant manager.

        This is called at the start of each day before any staff get on
        duty or any orders come in. You should do any setup necessary
        to get the system working before the day starts here; we have
        already defined a staff dictionary.
        """
        self.staff = {}

        # for fairly sharing the requests to staff:
        # this dictionary stores the staff ids and the the time they were last
        # requested to prep food
        # {<id>: <timestamp>, ...}
        self.staff_last_requested = {}

    async def __call__(self, request: Request):
        """Handle a request received.

        This is called for each request received by your application.
        In here is where most of the code for your system should go.

        :param request: request object
            Request object containing information about the sent
            request to your application.
        """

        if request.scope['type'] == 'staff.onduty':
            self.staff[request.scope['id']] = request
            self.staff_last_requested[request.scope['id']] = -inf # also add to the last req'd dict

        if request.scope['type'] == 'staff.offduty':
            self.staff.pop(request.scope['id'])
            self.staff_last_requested.pop(request.scope['id']) # also remove from the last req'd dict

        if request.scope['type'] == 'order':
            # filtered dict of staff items where the staff speciality includes the requested speciality
            matched_staff = {
                k: v for k,v in self.staff.items() 
                if request.scope['speciality'] in v.scope['speciality'] 
            }
            # filtered dict of last requested times mirroring the staff dictionary
            matched_staff_last_requested = {
                k: self.staff_last_requested.get(k) for k in matched_staff
            }
            # the id of the staff to chose is the one who has been previously called least recently
            found_id = min(matched_staff_last_requested, key=matched_staff_last_requested.get)
            self.staff_last_requested[found_id] = time.time() # update the time that this staff was last called
            found = matched_staff.get(found_id)

            full_order = await request.receive()
            await found.send(full_order)

            result = await found.receive()
            await request.send(result)
