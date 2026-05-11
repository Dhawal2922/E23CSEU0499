# Notification System Design

## Stage 1
### Priority Inbox Architecture
To implement the Priority Inbox feature, we need a mechanism to rank incoming notifications effectively based on two primary dimensions:
1. **Weight**: Categorical importance (`Placement` > `Result` > `Event`)
2. **Recency**: The time the notification was generated (newest first).

#### Priority Algorithm
Each notification is mapped to an internal integer weight score:
- **Placement**: `3`
- **Result**: `2`
- **Event**: `1`

The sorting algorithm uses a two-level comparator:
1. First, compare the integer weight score of `Notification A` and `Notification B`. If they differ, the one with the higher weight is sorted first.
2. If the weight scores are identical, parse the `Timestamp` field into an epoch integer, and sort descending (most recent first).

#### Data Structure & Maintenance
Currently, the system executes an in-memory sort of the fetched notifications. 
For production, efficiently maintaining the top 10 notifications as new data flows in continuously requires an optimal data structure:
- **Max-Heap (Priority Queue)**: Inserting a new notification into a Max-Heap is `O(log N)`. Retrieving the top 10 elements involves popping the head of the heap 10 times, taking `O(K log N)` where `K=10`. This avoids sorting the entire notification array (`O(N log N)`) every time a single new event arrives.
- **Caching**: The current Top N can be cached in a Redis Sorted Set (ZSET) allowing instantaneous fetching of priority notifications without hitting the primary database.

## System Architecture
*(To be expanded in later stages)*

## Components
*(To be expanded in later stages)*

## Data Flow
*(To be expanded in later stages)*
