import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';

const AccordionStyled = styled((props) => <Accordion {...props} />)(() => ({
  backgroundColor: '#cc99ff',
}));
const AccordionSummaryStyled = styled((props) => (
  <AccordionSummary {...props} />
))(() => ({
  backgroundColor: '#cc99ff',
}));
const AccordionDetailsStyled = styled((props) => (
  <AccordionDetails {...props} />
))(() => ({
  backgroundColor: '#d9b3ff',
}));

export { AccordionStyled, AccordionSummaryStyled, AccordionDetailsStyled };
