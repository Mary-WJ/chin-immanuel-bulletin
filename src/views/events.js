export function renderEvents(container) {
  container.innerHTML = `
    <div class="page">

      <header class="page-header">

        <h1>
          Upcoming events
        </h1>

        <p>
          Soonest first
        </p>

      </header>


      <div class="placeholder-card">
        Events will go here next.
      </div>

    </div>
  `
}