import { Fragment, useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Card, Form } from 'react-bootstrap';

import { StandForm } from '../types';
import { BACKGROUND_COUNT, getPageTitle } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faRefresh } from '@fortawesome/free-solid-svg-icons';

export function Component() {
  const [backgroundSrc, setBackgroundSrc] = useState<string>(null);
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const { errors, values, handleSubmit, handleChange } = useFormik<StandForm>({
    initialValues: {
      name: 'Stand Name',
      master: 'Master Name',
      power: 3,
      speed: 3,
      range: 3,
      durability: 3,
      precision: 3,
      potential: 3
    },
    onSubmit: () => {}
  });
  const handleNewBackground = useCallback(
    () => setBackgroundIndex(Math.ceil(Math.random() * BACKGROUND_COUNT)),
    []
  );

  useEffect(() => {
    async function loadNewImage() {
      setBackgroundSrc(
        (await import(`../images/${backgroundIndex}.png`)).default
      );
    }

    loadNewImage();
  }, [backgroundIndex]);

  return (
    <Fragment>
      <title>{getPageTitle('Generate Stand')}</title>
      <Card body>
        <Card.Title>Generate Stand</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <h4>General</h4>
          </Form.Group>
          <Form.Group>
            <Form.Label>Stand Name</Form.Label>
            <Form.Control
              isInvalid={Boolean(errors.name)}
              name="name"
              onChange={handleChange}
              type="text"
              value={values.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Stand Master</Form.Label>
            <Form.Control
              isInvalid={Boolean(errors.master)}
              name="master"
              onChange={handleChange}
              type="text"
              value={values.master}
            />
            <Form.Control.Feedback type="invalid">
              {errors.master}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mt-2">
            <h4>Stats</h4>
          </Form.Group>
          <Form.Group>
            <Form.Label>Power</Form.Label>
            <Form.Range
              max={5}
              min={1}
              name="power"
              onChange={handleChange}
              step={1}
              value={values.power}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Speed</Form.Label>
            <Form.Range
              max={5}
              min={1}
              name="speed"
              onChange={handleChange}
              step={1}
              value={values.speed}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Range</Form.Label>
            <Form.Range
              max={5}
              min={1}
              name="range"
              onChange={handleChange}
              step={1}
              value={values.range}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Durability</Form.Label>
            <Form.Range
              max={5}
              min={1}
              name="durability"
              onChange={handleChange}
              step={1}
              value={values.durability}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Precision</Form.Label>
            <Form.Range
              max={5}
              min={1}
              name="precision"
              onChange={handleChange}
              step={1}
              value={values.precision}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Potential</Form.Label>
            <Form.Range
              max={5}
              min={1}
              name="potential"
              onChange={handleChange}
              step={1}
              value={values.potential}
            />
          </Form.Group>
          <Form.Group>
            <h4>Actions</h4>
          </Form.Group>
          <Form.Group>
            <Button
              className="my-2"
              onClick={handleNewBackground}
              type="submit"
            >
              <FontAwesomeIcon icon={faDice} /> New Background
            </Button>
          </Form.Group>
          <Form.Group>
            <Button type="submit">
              <FontAwesomeIcon icon={faRefresh} /> Update
            </Button>
          </Form.Group>
        </Form>
      </Card>
      <div
        className="my-4"
        style={{
          backgroundImage: `url("${backgroundSrc}")`,
          maxWidth: 1280,
          height: 696
        }}
      >
        &nbsp;
      </div>
      &nbsp;
    </Fragment>
  );
}
