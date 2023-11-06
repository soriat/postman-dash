# Postman Takehome API Dashboard

Implemented over the course of: ~3 days

Hosted: [https://www.tsoria.com/postman-dash](https://www.tsoria.com/postman-dash)

![Screenshot](https://i.imgur.com/ftP6Isp.png)

## Installation

To install: `npm install`

To run: `npm start` or `npm run build`

## Design Decisions and Principles

##### Data should never be overwhelming.

If the dataset is too large for a visualization, then grouping, averaging, or other practices should be put in place so the chart remains valuable.

##### Filters and visualizations should be visible together and dynamically update at all times.

Real-time feedback is where I found the most value for these visualizations. Otherwise, it's hard to compare "before" and "after" states.

##### Data should be consistent and relevant

Hide useless analytics and stats so that valuable information stands out more strongly.
Ensure shown data (be it data points, chart legends, filter content, etc...) is shown in a predictable way.

##### Allow users to drill down on issues.

Visualizations and filters should act as a funnel to the final data. In real datasets there will be information that can't be shown in charts. Therefore, the full data should still be accessible.

## Functionality

#### Filters

##### Endpoint Filter

- Collapsable list of endpoints show in Sidebar
  - Endpoints can be toggled on/off
  - "Select All" / "Deselect All" Toggle

##### Time Range Filter

- Smooth, double range selector containing full date range of dataset
- Shows selected date range below selector

##### Status Code Filter

- Contains 5 filtering options
  - Granular: All status codes
  - Combined: 2xxs are combined as "success". All others are "failure"
  - Successes: Only show 2xx statuses
  - Failures: Only show non-2xx statuses
  - Specific: Allows using second dropdown to specifically set status codes
    - Specific status codes are combined into two groups depending on whether or not they appear in the data-set.

#### API Analytics

These metrics are shown below endpoints in the sidebar

##### API %s

- Health % refers to the percentage of endpoints that succeeded.
- Speed % refers to the percentage of endpoints that responded in under 1 second.
- 90% and over is shown as green. <80% is red.

##### API trends

- Shown next to API health and speed
- Indicates whether the endpoint is improving or not over the selected time range for these respective attributes
- Upward trends are indicated as green. Red otherwise.

## Charts / Visualizations

#### Line Chart (Response Time)

- Shows response times for the selected endpoints over time
  - Average response time for this range is shown in the subtitle
- Averaging input field smooths curves to better visualize trends.
- Dynamic x and y axis

#### Bar Charts (Status Codes)

- Chart #1 shows status_code distribution by hour
  - Useful in real datasets where traffic usually spikes at certain times of day
- Chart #2 shows status_codes over time.
- Dynamic y axis

#### Pie Charts

- Used to better visualize the distribution of status_codes over the given time range
- The Error Pie Chart shows the error distribution (which is especially useful if a given error_code can return different error messages)

#### Table

- Contains all data points for the selected filters
- Paginated
- Sortable by Column
- Handles empty states gracefully
- Self-scrollable with variable rows per page

## Assumptions Made

The main assumption made was that performance wouldn't be an issue. I implemented optimizations where I could but caching and memoization need to be implemented for bigger datasets.

I also assumed that any datasets plugged into this would contain the 5 fields provided in the example. Any additional fields should work fine and even be rendered in the table.

## Future Improvements

I wanted there to be multiple pages/dashboards where users could save custom charts. Perhaps take a note from Postman and create collections of APIs as well.

I had implemented a dark mode but nivo charts didn't play nicely with it so I scrapped it to focus on the main task.

Better responsiveness. The grid styling can only be squished so far and different charts need different rules. Pie Charts, for example, look hilariously tiny when squished due to their labels. This can be fixed by removing the labels in favor of legends however.

Saving the state in LocalStorage so that it could persist through page loads would be nice. I already unified the state into a global provider so it should be really easy to do so; just not important.

This can be infinitely expanded depending on whether or not we get a richer dataset. One very important (but missing) signal is what the HTTP method is for these responses. The same endpoint can even support multiple types of methods. Perhaps all the failures in /a/b/c/ are POSTs while the GETs were succeeding.

There are good tools for geo charts as well. If this data was available a world map showing the origin or requests would be useful and easy to add.

And of course, more predictive tools and analytics. Ideally tied in to an alert system with user defined thresholds.
