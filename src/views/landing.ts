export function renderLanding(main: HTMLElement): void {
  main.innerHTML = `
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <h1>Stop chasing bookings through WhatsApp.</h1>
          <p class="hero-sub">
            Every job starts the same way right now: a voice note, three photos
            of the problem, and a slow back-and-forth to land on a time.
            Here's what it looks like if the customer fills in the job card
            themselves — and you still get the WhatsApp.
          </p>
          <div class="btn-row">
            <a href="#book" class="btn btn-amber">Try booking a job →</a>
            <a href="#admin" class="btn btn-ghost">See the job sheet →</a>
          </div>
        </div>
        <div class="compare">
          <div class="compare-card">
            <h3>The old way — six messages, five hours</h3>
            <div class="chat">
              <div class="bubble in">Hiya, do you do brakes? Making a grinding noise<time>09:14</time></div>
              <div class="bubble out">Yeah can do, what car is it<time>09:41</time></div>
              <div class="bubble in">Ford Fiesta 2019<time>10:02</time></div>
              <div class="bubble out">Ok when were you thinking<time>10:03</time></div>
              <div class="bubble in">This week if poss, I work till 5 most days<time>10:20</time></div>
              <div class="bubble out">Free thu morning, around 9?<time>14:12</time></div>
              <div class="bubble in">Yh works 👍<time>14:50</time></div>
            </div>
          </div>
          <div class="compare-card">
            <h3>The new way — in on one card</h3>
            <div class="ticket">
              <div class="ticket-row"><span class="k ticket-ref">FMZ-7F2K</span><span class="v status-chip status-new">New</span></div>
              <div class="ticket-row"><span class="k">Service</span><span class="v">Brakes — grinding at low speed</span></div>
              <div class="ticket-row"><span class="k">Vehicle</span><span class="v">Ford Fiesta, LD19 KPX</span></div>
              <div class="ticket-row"><span class="k">Wants</span><span class="v">Thu morning, 8–11am</span></div>
              <div class="ticket-row"><span class="k">Contact</span><span class="v">Dale Whitmore</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="reasons">
      <div class="wrap">
        <h2>Same job, three things that change for you.</h2>
        <div class="reasons-grid">
          <div class="reason">
            <h3>Nothing lost in a chat thread</h3>
            <p>Vehicle, problem, and the time they want are on one card, not buried three screens back under "ok thanks 👍".</p>
          </div>
          <div class="reason">
            <h3>You still get the WhatsApp</h3>
            <p>Every booking still lands on your phone the moment it comes in — it just arrives already filled in instead of empty.</p>
          </div>
          <div class="reason">
            <h3>One list, not a mental tally</h3>
            <p>Every job you've got on — new, confirmed, done — in one sheet, instead of remembering who you already replied to.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="closing">
      <div class="wrap">
        <h2>See it from both sides — it only takes two minutes.</h2>
        <div class="btn-row">
          <a href="#book" class="btn btn-amber">Book a job, as a customer →</a>
          <a href="#admin" class="btn btn-ghost">Open the job sheet, as the mechanic →</a>
        </div>
      </div>
    </section>
  `;
}
