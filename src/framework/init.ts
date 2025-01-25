import { FButton } from "../shared/components/fbutton/fbutton";
import { FInput } from "../shared/components/input/input";
import { FLink } from "../shared/components/link/link";
import { FLinkButton } from "../shared/components/linkbutton/linkbutton";
import { Broadcast } from "./broadcast";
import { HTTP } from "./http";
import { NetworkService } from "./network";
import { Router } from "./router";
import { Store } from "./store";

const frameworkComponents = {
    FButton,
    FLinkButton,
    FLink,
    FInput,
    Router,
    Broadcast,
    HTTP,
    NetworkService,
    Store,
    init: () => {},
};

export default frameworkComponents;
