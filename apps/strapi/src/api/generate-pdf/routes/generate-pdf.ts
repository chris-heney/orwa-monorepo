export default {
  routes: [
    {
     method: 'PUT',
     path: '/generate-pdf',
     handler: 'generate-pdf.generatePdf',
     config: {
       policies: [],
       middlewares: [],
     },
    },
 ],
};
