# API documentation for Bookings

Do note that it is in `application/json` content-type.

## `/api/bookings/`

### Get Request

Return all bookings for that individual person.

#### Url Params

1. `limit`: Limit the number of bookings that can be acquired.

2. `offset`: Offset by how many bookings

### Post Request

Create bookings. Can create multiple bookings at once.

#### Fields needed

1. `booker`: id of the booker

2. `venue`: id of the venue

3. `form_data`: form data to be stored

4. `start_date`: starting date for the booking in Django time-format or datetime object -> `YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]`

5. `end_date`: end date for the booking in Django time-format or datetime object -> `YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]`

6. `status`: status of the booking (PENDING -> 0, CONFIRMED -> 1, REJECTED -> 2, CANCELLED -> 3)

### Patch request

Change booking status.

#### Fields needed

1. `id`: booking id to be changed

2. `status`: status to be updated

### Delete Request

Delete multiple bookings. FOR ADMIN ONLY.

#### Fields needed

1. `id`: an array of booking ids to be deleted.

## `api/bookings/all/`

### Get Request

Return all bookings for that organisation.

#### URL params

1. `limit`: Limit the number of bookings that can be acquired.

2. `offset`: Offset by how many bookings

3. `status`: Filter by status

4. `start`: Filter by start_date

5. `end`: Filter by end_date

6. `venue`: Filter by venue_id
