import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { _sendEmail, _sendFeedback } from "../helpers/API";
import Panel from "../components/Panel";
import { ui } from "../ui/tokens";

export default function FeedbackForm() {
  const { conference } = useConferenceKioskProvider();
  const year = new Date().getFullYear();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    _sendEmail({
      to: "Marcosje2005@gmail.com",
      from: data.email.toString(),
      html: `
        <p style="font-size: 16px;"><strong>From:</strong> ${data.name}</p>
        <p style="font-size: 16px;"><strong>Feedback:</strong> ${data.feedback}</p>
      `,
      subject: `${conference.name} ${year} Feedback from ${data.name}`,
    }).then(() => {
      alert("Thank you for your feedback!");
      form.reset();
    });

    _sendEmail({
      to: "office@orwa.org",
      from: data.email.toString(),
      html: `
        <p style="font-size: 16px;"><strong>From:</strong> ${data.name}</p>
        <p style="font-size: 16px;"><strong>Feedback:</strong> ${data.feedback}</p>
      `,
      subject: `${conference.name} ${year} Feedback from ${data.name}`,
    });

    _sendFeedback({
      conference: conference.id,
      year: new Date().getFullYear(),
      name: data.name.toString(),
      email: data.email.toString(),
      feedback: data.feedback.toString(),
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Panel title={`${conference.name} Feedback`}>
        <p className={ui.muted}>
          Help us improve the conference experience. Tell us what you think.
        </p>
        <form className="mt-5 space-y-4" onSubmit={handleFormSubmit} noValidate>
          <div>
            <label htmlFor="name" className={ui.label}>
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className={ui.input}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className={ui.label}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className={ui.input}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="feedback" className={ui.label}>
              Feedback
            </label>
            <textarea
              name="feedback"
              id="feedback"
              rows={5}
              required
              className={ui.input}
              placeholder="Your feedback"
            />
          </div>
          <button type="submit" className={`${ui.btnPrimary} w-full`}>
            Submit Feedback
          </button>
        </form>
      </Panel>
    </div>
  );
}
