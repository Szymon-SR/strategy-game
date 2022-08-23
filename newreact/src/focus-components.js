import React, { useContext } from "react"
import { SelectedDispatch } from "./App.js"

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
      handlePlayerActions={props.handlePlayerActions}
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
        <Actions
          handlePlayerActions={props.handlePlayerActions}
        />
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
      <Row className="mb-3">
        <Col>
          <ActionCard
            type="Claim"
            handlePlayerActions={() => props.handlePlayerActions({type: "claim"})}
          />
        </Col>
        <Col>
          jo
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <ActionCard
            type="Tower"
            handlePlayerActions={() => props.handlePlayerActions({type: "build", building: "tower"})}
          />
        </Col>
        <Col>
          <ActionCard
            type="Windmill"
            handlePlayerActions={() => props.handlePlayerActions({type: "build", building: "windmill"})}
          />
        </Col>
      </Row>
    </Container>
    //<Button onClick={() => console.log("xd")}>Attack</Button>
  )
}

function ActionCard(props) {
  let imageSrc = "./images/" + props.type + ".png"

  const descriptions = {
    "Tower": "Looks cool, will do something I guess",
    "Windmill": "Increases income in tile by 50%",
    "Claim": "Add this tile to your kingdom",
  };
  const costs = {
    "Tower": "Build for 150",
    "Windmill": "Build for 200",
    "Claim": "Claim for 250"
  };

  return (
    <Card>
      <Card.Img variant="top" src={require(`${imageSrc}`)} width={"50px"} />
      <Card.Body>
        <Card.Title>{props.type}</Card.Title>
        <Card.Text>
          {descriptions[props.type]}
        </Card.Text>
        <Button variant="primary" onClick={props.handlePlayerActions}>
          {costs[props.type]}
        </Button>
      </Card.Body>
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