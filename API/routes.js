import ProcessController from "./process/controller";

const Routes = async (app) => {
  app.post("/ajiranet/process", ProcessController);
};

export default Routes;
