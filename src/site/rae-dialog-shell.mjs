export const raeDialog = `
<dialog id="rae-dialog" class="rae-dialog" aria-labelledby="rae-heading" aria-describedby="rae-description">
  <div class="rae-shell">
    <header class="dialog-head">
      <div class="rae-identity">
        <small>BRAYRO AI / STUDIO CONCIERGE</small>
        <h2 id="rae-heading">Rae<span aria-hidden="true">.</span></h2>\n        <span class="rae-availability"><i aria-hidden="true"></i>AI studio guide</span>
      </div>
      <div class="rae-head-actions">
        <button class="rae-new-conversation" type="button" data-rae-reset aria-label="Start a new conversation with Rae">
          <span aria-hidden="true">New thread</span>
        </button>
        <button class="rae-close" type="button" data-rae-close aria-label="Close Rae">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </header>

    <div class="rae-workspace">
      <aside class="rae-intro" aria-label="About Rae">
        <div class="rae-actor" data-rae-actor aria-hidden="true">
          <img class="rae-face" src="/assets/rae-face.svg" alt="" width="180" height="180">
        </div>
        <div class="rae-intro-copy">
          <span class="rae-kicker">RAE / PROJECT GUIDE</span>
          <p id="rae-description">Tell Rae what you are trying to build, fix, compare, or understand. She keeps the answer grounded in BRAYRO AI's studio, plans, and published work.</p>
        </div>
        <div class="rae-compass" aria-hidden="true">
          <span>Scope</span><span>Compare</span><span>Explain</span>
        </div>
      </aside>

      <section class="rae-conversation" aria-label="Conversation with Rae">
        <div class="rae-thread" tabindex="0" role="region" aria-label="Conversation and starting questions">
          <div class="rae-starts" role="group" aria-label="Ways Rae can help">
            <p><span>Choose an intent</span><small>Or write naturally below.</small></p>
            <button type="button" data-rae-prompt="Help me plan a new website or digital product for my business.">
              <span>01 / PLAN</span><strong>Find the right project path</strong><i aria-hidden="true">↗</i>
            </button>
            <button type="button" data-rae-prompt="Compare BRAYRO AI's website and AI offers for me.">
              <span>02 / COMPARE</span><strong>Compare offers without the sales fog</strong><i aria-hidden="true">↗</i>
            </button>
            <button type="button" data-rae-prompt="Show me verified BRAYRO AI client work and explain what was made.">
              <span>03 / PROOF</span><strong>See published work and what it proves</strong><i aria-hidden="true">↗</i>
            </button>
          </div>

          <div class="rae-thread-empty" aria-hidden="true">
            <span>Conversation space</span>
            <p>A first idea is enough.</p>
          </div>
          <div class="rae-messages" role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions text"></div>
        </div>

        <div class="rae-status-row">
          <p class="rae-status" role="status"></p>
          <button class="rae-stop" type="button" data-rae-stop hidden>Stop response</button>
        </div>

        <form class="rae-form">
          <label for="rae-input">MESSAGE RAE</label>
          <div class="rae-composer">
            <textarea id="rae-input" name="message" rows="2" maxlength="1200" placeholder="What do you need to build, fix, compare, or understand?" aria-describedby="rae-composer-hint"></textarea>
            <button type="submit" aria-label="Send message to Rae">
              <span aria-hidden="true">Send</span><i aria-hidden="true">↑</i>
            </button>
          </div>
          <p class="rae-composer-hint" id="rae-composer-hint">Enter to send · Shift + Enter for a new line.</p>
        </form>

        <footer class="rae-dialog-foot">
          <span>Rae can guide the decision. Final scope and quotes are confirmed by Yash.</span>
          <a class="rae-fallback" href="mailto:yashganesh.work@gmail.com">Human handoff ↗</a>
        </footer>
      </section>
    </div>
  </div>
</dialog>`;

export default raeDialog;
