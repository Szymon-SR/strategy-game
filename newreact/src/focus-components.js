import React, { useContext } from "react"
import { SelectedDispatch } from "./index.js"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

//Right
function FocusMenu(props) {
  let child;

  if (props.anySelected) {
    child = <HexAction
      selectedId={props.selectedId}
      selectedIncome={props.selectedIncome}
    />
  }
  else {
    child = <BaseAction />
  }

  return (
    <div
      className="focus-menu"
    >
      {child}
    </div>
  )
}

function BaseAction(props) {
  return (
    <div>
      BaseAc
    </div>
  )
}

function HexAction(props) {
  return (
    <Container>
      <Row>
        <TileInfo
          selectedId={props.selectedId}
          selectedIncome={props.selectedIncome}
        />
      </Row>
      <Row>
        <Actions />
      </Row>
      <Row>
        <Unselect
          selectedId={props.selectedId}
        />
      </Row>
    </Container>

  )
}

function TileInfo(props) {
  return (
    <Table bordered="true">
      <tbody>
        <tr>
          <td>Selected Tile</td>
          <td>{props.selectedId}</td>
        </tr>
        <tr>
          <td>Income from this tile</td>
          <td>{props.selectedIncome}</td>
        </tr>
      </tbody>
    </Table>
  )
}

function Actions(props) {
  let imageSrc = "./images/" + "tower" + ".png"
  return (
    <Container>
      <Row>
        <Col>
          <ActionCard type="tower" />
        </Col>
        <Col>
          <ActionCard type="windmill" />
        </Col>
      </Row>

      <Row>
        <Col>
          xd
        </Col>
        <Col>
          xd
        </Col>
      </Row>
    </Container>
    //<Button onClick={() => console.log("xd")}>Attack</Button>
  )
}

function ActionCard(props) {
  let imageSrc = "./images/" + props.type + ".png"

  return (
    <Card>
      <Card.Img variant="top" src={require(`${imageSrc}`)} width={"50px"} />
    </Card>
  )
}

function Unselect(props) {
  // unselecting
  const dispatch = useContext(SelectedDispatch);

  function handleClick() {
    dispatch({ type: "unselect", clickedId: props.selectedId });
  }

  return (
    <Button onClick={handleClick}>
      Unselect
    </Button>
  )
}

export { FocusMenu };