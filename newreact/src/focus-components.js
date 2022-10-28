import React, { useContext, useState } from "react"
import { SelectedDispatch } from "./App.js"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

//Right
function FocusMenu(props) {
  let child;

  if (props.anySelected) {
    child = <HexAction
      selectedId={props.selectedId}
      selectedIncome={props.selectedIncome}
      selectedDefensiveness={props.selectedDefensiveness}
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
      Click any tile to see details
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
          selectedDefensiveness={props.selectedDefensiveness}
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
    <table>
        <tr>
          <td>Selected Tile</td>
          <td>{props.selectedId}</td>
        </tr>
        <tr>
          <td>Income from this tile</td>
          <td>{props.selectedIncome}</td>
        </tr>
        <tr>
          <td>Defense of this tile</td>
          <td>{props.selectedDefensiveness}</td>
        </tr>
    </table>
  )
}

function Actions(props) {
  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <ActionCard
            type="Claim"
            handlePlayerActions={() => props.handlePlayerActions({ type: "claim" })}
          />
        </Col>
        <Col>
          <ActionCard
            type="Recruit"
            handlePlayerActions={() => props.handlePlayerActions({ type: "recruit" })}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <ActionCard
            type="Tower"
            handlePlayerActions={() => props.handlePlayerActions({ type: "build", building: "tower" })}
          />
        </Col>
        <Col>
          <ActionCard
            type="Windmill"
            handlePlayerActions={() => props.handlePlayerActions({ type: "build", building: "windmill" })}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Movement
          handlePlayerActions={props.handlePlayerActions}
        />
      </Row>
    </Container>
    //<Button onClick={() => console.log("xd")}>Attack</Button>
  )
}

function ActionCard(props) {
  let imageSrc = "./images/" + props.type + ".png"

  const descriptions = {
    "Tower": "Increases defense in tile",
    "Windmill": "Increases income in tile by 50%",
    "Claim": "Add this tile to your kingdom",
    "Recruit": "Train new soldiers here",
  };
  const costs = {
    "Tower": "Build for 150",
    "Windmill": "Build for 200",
    "Claim": "Claim for 250",
    "Recruit": "Recruit for 50",
  };

  return (
    <Card>
      <Card.Img variant="top" src={require(`${imageSrc}`)} height={"100px"} />
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

function Movement(props) {
  const [moveCount, setMoveCount] = useState(1);
  const [direction, setDirection] = useState("topleft");

  function decreaseCount() {
    if (moveCount > 1) {
      setMoveCount(moveCount - 1);
    }
  }

  function increaseCount() {
    if (moveCount < 10) {
      setMoveCount(moveCount + 1);
    }
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Directions 
            setDirection={setDirection}
          />
        </Col>
        <Col>
          <Button onClick={() => increaseCount()}>
            +
          </Button>
          <Button onClick={() => decreaseCount()}>
            -
          </Button>
          <Badge pill> {moveCount} </Badge>
        </Col>
      </Row>
      <Row>
        <Button onClick={() => props.handlePlayerActions({type: "move", direction: direction, count: moveCount})}>
          Move soldiers
        </Button>
      </Row>
    </Container>
  )
}

function Directions(props) {

  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={() => props.setDirection("topleft")}>⇖</Button>
        </Col>
        <Col>
          <Button onClick={() => props.setDirection("topright")}>⇗</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => props.setDirection("left")}>⇐</Button>
        </Col>
        <Col>
          <Button onClick={() => props.setDirection("right")}>⇒</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => props.setDirection("bottomleft")}>⇙</Button>
        </Col>
        <Col>
          <Button onClick={() => props.setDirection("bottomright")}>⇘</Button>
        </Col>
      </Row>
    </Container>
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
      Close
    </Button>
  )
}

export { FocusMenu };