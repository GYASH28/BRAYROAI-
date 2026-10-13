export const raeDialog = `
<dialog id="rae-dialog" class="rae-dialog" aria-labelledby="rae-heading" aria-describedby="rae-description">
  <div class="rae-shell">
    <header class="dialog-head">
      <div class="rae-identity">
        <span class="rae-monogram" aria-hidden="true">R</span>
        <div>
          <small>BRAYRO / STUDIO INTELLIGENCE</small>
          <h2 id="rae-heading">Rae</h2>
        </div>
        <span class="rae-availability"><i aria-hidden="true"></i>Online · context aware</span>
      </div>

      <div class="rae-head-context" aria-label="Rae context">
        <span><small>PAGE</small><strong data-rae-page>Studio</strong></span>
        <span><small>MARKET</small><strong data-rae-market>India</strong></span>
        <span><small>MODE</small><strong data-rae-mode>Explore</strong></span>
      </div>

      <div class="rae-head-actions">
        <button class="rae-new-conversation" type="button" data-rae-reset aria-label="Start a new conversation with Rae">
          <span aria-hidden="true">New</span><i aria-hidden="true">＋</i>
        </button>
        <button class="rae-close" type="button" data-rae-close aria-label="Close Rae">
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </header>

    <div class="rae-workspace">
      <aside class="rae-presence" aria-label="Rae presence">
        <div class="rae-presence-grid" aria-hidden="true"></div>
        <div class="rae-presence-index" aria-hidden="true">
          <span>R / 01</span><span>BRAYRO SYSTEM</span>
        </div>

        <div class="rae-actor" data-rae-actor aria-hidden="true">
          <img class="rae-face" src="/assets/rae-face.svg" alt="" width="320" height="380">
        </div>

        <div class="rae-presence-copy">
          <span class="rae-kicker">RAE / DIGITAL CONCIERGE</span>
          <p id="rae-description">A studio-side intelligence for shaping briefs, comparing offers, and finding the strongest route through BRAYRO.</p>
        </div>

        <div class="rae-presence-state" aria-live="polite">
          <span class="rae-presence-pulse" aria-hidden="true"></span>
          <div><small>STATE</small><strong data-rae-presence-state>Ready</strong></div>
          <div><small>SCOPE</small><strong>Studio only</strong></div>
        </div>
      </aside>

      <section class="rae-conversation" aria-label="Conversation with Rae">
        <div class="rae-session-bar">
          <div class="rae-session-title">
            <span aria-hidden="true">◌</span>
            <div><small>ACTIVE THREAD</small><strong data-rae-session-label>Untitled brief</strong></div>
          </div>
          <span class="rae-session-note">Rae uses this page + BRAYRO's verified studio context.</span>
        </div>

        <div class="rae-thread" tabindex="0" role="region" aria-label="Conversation and starting questions">
          <div class="rae-starts" role="group" aria-label="Ways Rae can help">
            <div class="rae-starts-heading">
              <span class="rae-starts-eyebrow">START ANYWHERE</span>
              <h3>What are we making?</h3>
              <p>Give Rae the messy version. She will turn it into a direction.</p>
            </div>

            <button type="button" data-rae-mode-choice="Plan" data-rae-prompt="Help me turn my rough idea into the right BRAYRO website or digital product plan.">
              <span>01</span>
              <div><small>SHAPE</small><strong>A rough idea into a clear project</strong></div>
              <i aria-hidden="true">↗</i>
            </button>

            <button type="button" data-rae-mode-choice="Compare" data-rae-prompt="Compare BRAYRO AI's offers for my needs, explain the tradeoffs, and tell me where I should start.">
              <span>02</span>
              <div><small>COMPARE</small><strong>Find the right offer without the sales fog</strong></div>
              <i aria-hidden="true">↗</i>
            </button>

            <button type="button" data-rae-mode-choice="Proof" data-rae-prompt="Show me verified BRAYRO AI work and explain what each project proves.">
              <span>03</span>
              <div><small>PROOF</small><strong>Explore real work before making a decision</strong></div>
              <i aria-hidden="true">↗</i>
            </button>
          </div>

          <div class="rae-thread-empty" aria-hidden="true">
            <span>CONVERSATION CANVAS</span>
            <p>Your first message becomes the working brief.</p>
          </div>

          <div class="rae-messages" role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions text"></div>
        </div>

        <div class="rae-status-row">
          <p class="rae-status" role="status"></p>
          <button class="rae-stop" type="button" data-rae-stop aria-label="Stop response" hidden>Stop</button>
        </div>

        <form class="rae-form">
          <div class="rae-composer-shell">
            <div class="rae-composer-meta">
              <span>COMMAND / MESSAGE</span>
              <span>Rae reads the current page</span>
            </div>
            <div class="rae-composer">
              <textarea id="rae-input" name="message" rows="2" maxlength="1200" placeholder="Describe the thing you want to build, fix, compare, or understand…" aria-describedby="rae-composer-hint"></textarea>
              <button type="submit" aria-label="Send message to Rae">
                <span aria-hidden="true">Send</span><i aria-hidden="true">↗</i>
              </button>
            </div>
          </div>
          <p class="rae-composer-hint" id="rae-composer-hint">Enter to send · Shift + Enter for a new line</p>
        </form>

        <footer class="rae-dialog-foot">
          <span><i aria-hidden="true">◎</i> Rae does not invent case studies, prices, or guarantees.</span>
          <a class="rae-fallback" href="mailto:yashganesh.work@gmail.com">Hand off to Yash ↗</a>
        </footer>
      </section>
    </div>
  </div>
</dialog>`;

export default raeDialog;
