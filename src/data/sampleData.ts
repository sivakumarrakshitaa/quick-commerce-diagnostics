export const EXPECTED_CSV_HEADER =
  'order_id,timestamp,zone,category,supplier,delivery_minutes,success';

export const PLACEHOLDER_CSV = `order_id,timestamp,zone,category,supplier,delivery_minutes,success
ORD001,2024-09-11 18:30:00,North Delhi,Electronics,Supplier A,45,0
ORD002,2024-09-11 18:32:00,East Delhi,Groceries,Supplier B,12,1
ORD003,2024-09-11 08:15:00,South Delhi,Fresh,Supplier C,11,1
ORD004,2024-09-11 20:10:00,North Delhi,Electronics,Supplier A,62,0
ORD005,2024-09-11 14:20:00,West Delhi,Cosmetics,Supplier D,18,1
ORD006,2024-09-11 19:45:00,Gurgaon,Snacks,Supplier B,38,0`;

export const SAMPLE_20_RECORDS_CSV = `order_id,timestamp,zone,category,supplier,delivery_minutes,success
ORD001,2024-09-11 18:25:00,North Delhi,Electronics,Supplier A,68,0
ORD002,2024-09-11 18:40:00,North Delhi,Electronics,Supplier A,64,0
ORD003,2024-09-11 19:10:00,East Delhi,Groceries,Supplier B,45,0
ORD004,2024-09-11 20:15:00,North Delhi,Groceries,Supplier B,16,1
ORD005,2024-09-11 18:15:00,West Delhi,Snacks,Supplier B,12,1
ORD006,2024-09-11 19:35:00,Gurgaon,Cosmetics,Supplier D,22,1
ORD007,2024-09-11 20:05:00,South Delhi,Fresh,Supplier C,15,1
ORD008,2024-09-11 20:45:00,North Delhi,Electronics,Supplier A,54,1
ORD009,2024-09-11 07:15:00,South Delhi,Fresh,Supplier C,9,1
ORD010,2024-09-11 08:30:00,East Delhi,Groceries,Supplier B,11,1
ORD011,2024-09-11 10:15:00,West Delhi,Cosmetics,Supplier D,14,1
ORD012,2024-09-11 11:20:00,North Delhi,Fresh,Supplier C,13,1
ORD013,2024-09-11 11:45:00,Gurgaon,Electronics,Supplier A,48,1
ORD014,2024-09-11 13:10:00,East Delhi,Fresh,Supplier C,14,1
ORD015,2024-09-11 14:25:00,South Delhi,Groceries,Supplier B,35,0
ORD016,2024-09-11 15:40:00,North Delhi,Snacks,Supplier B,10,1
ORD017,2024-09-11 16:50:00,Gurgaon,Fresh,Supplier C,12,1
ORD018,2024-09-11 17:30:00,North Delhi,Cosmetics,Supplier D,16,1
ORD019,2024-09-11 17:45:00,West Delhi,Electronics,Supplier A,52,0
ORD020,2024-09-11 21:30:00,South Delhi,Snacks,Supplier B,8,1`;

export const CANONICAL_ZONES = [
  'North Delhi',
  'South Delhi',
  'East Delhi',
  'West Delhi',
  'Gurgaon',
];

export const CANONICAL_CATEGORIES = [
  'Groceries',
  'Electronics',
  'Fresh',
  'Cosmetics',
  'Snacks',
];

export const HOUR_BUCKETS = [
  '6-9 AM',
  '9 AM-12 PM',
  '12-3 PM',
  '3-6 PM',
  '6-9 PM',
  '9 PM-12 AM',
] as const;
