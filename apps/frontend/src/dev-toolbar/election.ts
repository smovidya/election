import { event } from "@repo/constants";
import { defineToolbarApp } from "astro/toolbar";
import { api, authHeader } from "../lib/api";
import { mockTime, setMockTime } from "../lib/clock";

// datetime-local has no timezone: this panel always edits Bangkok wall time.
function bangkokInput(iso: string): string {
	return new Date(Date.parse(iso) + 7 * 60 * 60 * 1000)
		.toISOString()
		.slice(0, 19);
}

export default defineToolbarApp({
	init(canvas, app) {
		const style = document.createElement("style");
		style.textContent = `
      astro-dev-toolbar-window { width: min(420px, calc(100vw - 32px)); max-height: calc(100dvh - 110px); }
      .panel { overflow: auto; font: 14px/1.5 'Noto Sans Thai Looped Variable', sans-serif; }
      h2 { margin: 0; color: #fff; font-size: 22px; letter-spacing: -.5px; }
      .eyebrow { color: #ffd64f; font: 11px monospace; letter-spacing: 2px; text-transform: uppercase; }
      p { margin: 8px 0 16px; color: #bfc1c9; }
      fieldset { border: 0; border-top: 1px solid #343841; margin: 18px 0 0; padding: 16px 0 0; }
      legend { color: #ffd64f; padding-right: 12px; font-weight: 600; }
      label { display: block; margin: 10px 0; color: #e5e7eb; }
      input { box-sizing: border-box; width: 100%; margin-top: 5px; padding: 9px 10px; border: 1px solid #555b67; border-radius: 6px; background: #1c1f26; color: #fff; font: inherit; color-scheme: dark; }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
      button { padding: 8px 12px; border: 1px solid #555b67; border-radius: 6px; background: #232730; color: #fff; cursor: pointer; font: inherit; }
      button.primary { background: #ffd64f; color: #191b20; border-color: #ffd64f; font-weight: 600; }
      button:hover { border-color: #ffd64f; }
      :is(button, input):focus-visible { outline: 2px solid #ffd64f; outline-offset: 3px; }
      button:disabled { opacity: .5; cursor: wait; }
      small { display: block; color: #bfc1c9; margin-top: 8px; }
      #status { margin-bottom: 0; color: #ffd64f; overflow-wrap: anywhere; }
    `;
		const panel = document.createElement("astro-dev-toolbar-window");
		panel.innerHTML = `
      <div class="panel">
        <span class="eyebrow">Local development</span>
        <h2>Election test bench</h2>
        <p>Switch voters and explore the voting window.</p>
        <fieldset>
          <legend>Current user</legend>
          <small id="current-user">Checking session…</small>
          <div class="actions">
            <button type="button" data-user="6930000023">Test voter A</button>
            <button type="button" data-user="6930000123">Test voter B</button>
          </div>
          <form id="user-form">
            <label>Student ID<input id="student-id" required pattern="[0-9]{8}23" maxlength="10" inputmode="numeric" value="6930000023" /></label>
            <label>Name<input id="student-name" required maxlength="100" value="Test voter A" /></label>
            <div class="actions">
              <button class="primary" type="submit">Switch user</button>
              <button id="sign-out" type="button">Sign out</button>
            </div>
          </form>
        </fieldset>
        <fieldset>
          <legend>Election time</legend>
          <small id="current-time"></small>
          <div class="actions">
            <button type="button" data-time="before">Before</button>
            <button type="button" data-time="during">During</button>
            <button type="button" data-time="after">After</button>
          </div>
          <form id="time-form">
            <label>Bangkok time (UTC+07:00)<input id="time" type="datetime-local" step="1" required /></label>
            <div class="actions">
              <button class="primary" type="submit">Freeze time</button>
              <button id="reset-time" type="button">Use real time</button>
            </div>
          </form>
          <small>Frozen time lasts for this tab. Sessions expire using real time. Changes reload the page.</small>
        </fieldset>
        <p id="status" role="status" aria-live="polite"></p>
      </div>
    `;
		canvas.append(style, panel);
		const get = <T extends HTMLElement>(id: string): T => {
			const element = panel.querySelector<T>(`#${id}`);
			if (!element) throw new Error(`Missing toolbar control: ${id}`);
			return element;
		};
		const studentId = get<HTMLInputElement>("student-id");
		const studentName = get<HTMLInputElement>("student-name");
		const time = get<HTMLInputElement>("time");
		const status = get("status");
		const frozen = mockTime();
		time.value = bangkokInput(frozen ?? new Date().toISOString());
		get("current-time").textContent = frozen
			? `Frozen · ${bangkokInput(frozen).replace("T", " ")} +07:00`
			: "Live · real time";

		async function refreshUser() {
			const headers = authHeader();
			if (!headers) {
				get("current-user").textContent = "Signed out";
				return;
			}
			const { data } = await api.auth.me.get({ headers });
			get("current-user").textContent = data
				? `${data.studentName} · ${data.studentId}`
				: "Session expired or backend unavailable";
			if (data) {
				studentId.value = data.studentId;
				studentName.value = data.studentName;
			}
		}
		void refreshUser();
		app.onToggled(({ state }) => {
			if (state) void refreshUser();
		});

		let switching = false;
		async function switchUser() {
			if (switching) return;
			const form = get<HTMLFormElement>("user-form");
			if (!form.reportValidity()) return;
			switching = true;
			const buttons = panel.querySelectorAll<HTMLButtonElement>("button");
			buttons.forEach((button) => {
				button.disabled = true;
			});
			status.textContent = "Signing in…";
			try {
				const { data, error } = await api.auth["dev-login"].post({
					studentId: studentId.value,
					studentName: studentName.value.trim(),
				});
				if (error || !data)
					throw new Error(
						"Could not switch user. Start the local backend with ENVIRONMENT=dev.",
					);
				localStorage.setItem("session_token", data.jwtSessionToken);
				window.location.reload();
			} catch (error) {
				status.textContent =
					error instanceof Error ? error.message : "Could not switch user.";
				switching = false;
				buttons.forEach((button) => {
					button.disabled = false;
				});
			}
		}
		get<HTMLFormElement>("user-form").addEventListener("submit", (e) => {
			e.preventDefault();
			void switchUser();
		});
		panel
			.querySelectorAll<HTMLButtonElement>("[data-user]")
			.forEach((button) => {
				button.addEventListener("click", () => {
					const id = button.dataset.user;
					if (!id) return;
					studentId.value = id;
					studentName.value = button.textContent ?? "Test voter";
					void switchUser();
				});
			});
		get("sign-out").addEventListener("click", () => {
			localStorage.removeItem("session_token");
			window.location.assign(import.meta.env.BASE_URL);
		});
		function freeze(iso: string) {
			try {
				setMockTime(iso);
				window.location.reload();
			} catch (error) {
				status.textContent =
					error instanceof Error ? error.message : "Invalid time.";
			}
		}
		const presets: Record<string, string> = {
			before: new Date(event.votingStart.getTime() - 1000).toISOString(),
			during: new Date(
				(event.votingStart.getTime() + event.votingEnd.getTime()) / 2,
			).toISOString(),
			after: event.votingEnd.toISOString(),
		};
		panel
			.querySelectorAll<HTMLButtonElement>("[data-time]")
			.forEach((button) => {
				button.addEventListener("click", () => {
					const preset = presets[button.dataset.time ?? ""];
					if (preset) freeze(preset);
				});
			});
		get<HTMLFormElement>("time-form").addEventListener("submit", (e) => {
			e.preventDefault();
			freeze(
				`${time.value.length === 16 ? `${time.value}:00` : time.value}+07:00`,
			);
		});
		get("reset-time").addEventListener("click", () => {
			setMockTime(null);
			window.location.reload();
		});
	},
});
