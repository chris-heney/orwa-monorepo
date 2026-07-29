import { motion } from "framer-motion";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { _sendEmail, _sendFeedback } from "../helpers/API";

export default function FeedbackForm() {
  const { conference } = useConferenceKioskProvider();
  const year = new Date().getFullYear();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    // Validate form inputs
    if (!form.checkValidity()) {
      form.reportValidity(); // Display browser's validation messages
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Send feedback emails
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
    <motion.div
      className="bg-white p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-2xl text-gray-700 font-bold mb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {conference.name} Feedback!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Help us improve the conference experience! Let us know what you think!
      </motion.p>
      <motion.form
        className="mt-3 px-0 md:px-24 lg:px-48"
        onSubmit={handleFormSubmit}
        noValidate // Prevent default browser validation tooltips
      >
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2 text-left"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
            placeholder="Your Name"
          />
        </motion.div>
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2 text-left"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
            placeholder="Your Email"
          />
        </motion.div>
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <label
            htmlFor="feedback"
            className="block text-gray-700 text-sm font-bold mb-2 text-left"
          >
            Feedback
          </label>
          <textarea
            name="feedback"
            id="feedback"
            rows={5}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline"
            placeholder="Your Feedback"
          ></textarea>
        </motion.div>
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Submit
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}