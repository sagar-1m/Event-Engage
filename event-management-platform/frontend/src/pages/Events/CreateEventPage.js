import React from "react";
import EventForm from "../../components/events/EventForm";
import { Container } from "@mui/material";

const CreateEventPage = () => {
  return (
    <Container maxWidth="md">
      <EventForm />
    </Container>
  );
};

export default CreateEventPage;
