import "./index.scss";

import frameworkComponents from "./src/framework/init";
import appComponents from "./src/components/init";
import controllers from "./src/controllers/init";

controllers.init();
frameworkComponents.init();
appComponents.init();
