import React from "react";
import EventList from "../../components/events/EventList";
import { Container } from "@mui/material";

const EventListPage = () => {
  return (
    <Container maxWidth="lg">
      <EventList />
    </Container>
  );
};

export default EventListPage;
