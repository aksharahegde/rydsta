# Ride export formats (reference)

Documented from privacy export structure — **no personal rows**. Add Ola / Rapido sections here when ready.

> Source: maintained manually. Implementation fingerprints live in `shared/constants/providers.ts`.

---

## Uber

Uber gives zip files with following folders inside it:

### Account and Profile

- `customer_support_tickets-0.csv`  
  - Trip Request Time, Create Ticket Time, City, Country, Product Name, Locale, Modality
- `rider_eater_saved_locations.csv`  
  - Label, House number, Street name, City, State, Postal code, Country code, Latitude, Longitude
- `user_profile-0.csv`

### Eats

- `user_orders-0.csv`  
  - City_Name, Restaurant_Name, Request_Time_Local, Final_Delivery_Time_Local, Order_Status, Item_Name, Item_quantity, Customizations, Customization_Cost_Local, Special_Instructions, Item_Price, Order_Price, Currency

### Rider

- `rider_app_analytics-0.csv`  
  - Event Time (UTC), GPS Time (UTC), Horizontal Accuracy, Latitude, Longitude, Speed (GPS), City, Cellular Carrier, …
- `rider_lifetime_ratings_received-0.csv`  
  - five_star_rating
- **`trips_data-0.csv`** ← **primary file for Ride Wrapped**

Columns (`trips_data-0.csv`):

`city_name`, `currency_code`, `timezone`, `flow`, `product_type_name`, `global_product_name`, `request_timestamp_local`, `request_timestamp_utc`, `request_lat`, `request_lng`, `begintrip_timestamp_local`, `begintrip_timestamp_utc`, `begintrip_lat`, `begintrip_lng`, `begintrip_address`, `dropoff_timestamp_local`, `dropoff_timestamp_utc`, `dropoff_lat`, `dropoff_lng`, `destination_lat`, `destination_lng`, `has_destination`, `dropoff_address`, `eta`, `surge_multiplier`, `is_surged`, `is_pool_matched`, `request_to_begin_distance_miles`, `request_to_begin_duration_seconds`, `trip_distance_miles`, `trip_duration_seconds`, `status`, `is_completed`, `fare_amount`, `is_fare_split`, `is_flat_rate`, `is_cash_trip`, … (fare breakdown columns), `is_airport_trip`, `profile_type`, `card_number`

### Ride Wrapped mapping (Uber)

| Canonical field | Source column |
|-----------------|---------------|
| `startedAt` | `begintrip_timestamp_local` (fallback `request_timestamp_local`) |
| `endedAt` | `dropoff_timestamp_local` |
| `pickup` | `begintrip_address` |
| `dropoff` | `dropoff_address` |
| `fare` | `fare_amount` |
| `currency` | `currency_code` |
| `distanceKm` | `trip_distance_miles` × 1.60934 |
| `status` | `status` |
| `vehicleType` | `product_type_name` |

**Ignore** for trip story: `Eats/*`, `Account and Profile/*`, `rider_app_analytics-*`, `rider_lifetime_ratings_*`, `customer_support_*`, `saved_locations`, `user_profile-*`, `user_orders-*`.

---

## Ola

_TBD — add folder/file names and column lists._

---

## Rapido

_TBD — add folder/file names and column lists._
