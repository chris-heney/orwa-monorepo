/**
 * remove-registration service
 */

export default () => ({
    removeRegistration: async (ctx) => {
        try {
        ctx.body = 'ok';
        } catch (err) {
        ctx
        .badRequest(null, [{ messages: [{ id: 'remove-registration.error' }] }]);
        }
    }
});
