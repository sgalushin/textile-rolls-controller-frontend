import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "./App.css";
import { RollsList } from "../RollsList";
import { MenuBar } from "../MenuBar/";
import { RollRegistrationSuccess } from "../EditRollSuccess";
import { AboutPage } from "../AboutPage";
import { CuttingStudioPage } from "../CuttingStudioPage";
import { EmptyLabelsGeneratorPage } from "../EmptyLabelsGeneratorPage";
import { EditRollPage } from "../EditRollPage";
import { RollDetailsPage } from "../RollDetailsPage";

const AppInternal = () => {
  return (
    <Router>
      <MenuBar />
      <Switch>
        <Route path="/editRoll/:qrCodeUrlEncoded">
          <EditRollPage />
        </Route>
        <Route path="/editRoll/">
          <EditRollPage />
        </Route>
        <Route path="/editRollSuccess/created/:qrCodeUrlEncoded">
          <RollRegistrationSuccess operationType="create" />
        </Route>
        <Route path="/editRollSuccess/updated/:qrCodeUrlEncoded">
          <RollRegistrationSuccess operationType="update" />
        </Route>
        <Route path="/rolls/:physicalId/:qrCodeUrlEncoded">
          <RollDetailsPage />
        </Route>
        <Route path="/rolls">
          <RollsList />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/cuttingStudio">
          <CuttingStudioPage />
        </Route>
        <Route path="/emptyLabelsGenerator">
          <EmptyLabelsGeneratorPage />
        </Route>
      </Switch>
    </Router>
  );
};

export const App = withAuthenticator(AppInternal);
