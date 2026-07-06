
const tokenGenerator = (config, { strapi }) => {
  return async (context, next) => {
    const { user } = context.state;
    const { id } = user;
    context.body = { ...context.body, token: 'added' };
    await next();
  };
}

export default tokenGenerator;