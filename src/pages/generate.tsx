import { useFormik } from 'formik';
import { contrastColor } from 'contrast-color';
import { Button, Card, Form } from 'react-bootstrap';
import { FastAverageColor } from 'fast-average-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { StandForm } from '../types';
import radarPlotBg from '../images/radar-plot-bg.png';
import { BACKGROUND_COUNT, getPageTitle } from '../utils';

const radarRadiusCoefficient = 0.65;
const RADIAN = Math.PI / 180;

export function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [imageSrc, setImageSrc] = useState<string>(null);
  const [textColor, setTextColor] = useState<string>(null);
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const [backgroundSrc, setBackgroundSrc] = useState<string>(null);
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
    onSubmit: ({
      name,
      master,
      power,
      speed,
      range,
      durability,
      precision,
      potential
    }) => {
      if (!canvasRef.current || !containerRef.current) {
        return;
      }

      canvasRef.current.height = containerRef.current.offsetHeight;
      canvasRef.current.width = containerRef.current.offsetWidth;

      // const image = new Image();

      // image.onload = () => {
      //   ctx.drawImage(image, width - 400, height - 100);
      // };
      // image.src = imageSrc;

      const ctx = canvasRef.current.getContext('2d');
      const { width, height } = canvasRef.current;

      ctx.font = '48px MS Trebuchet';
      ctx.textBaseline = 'top';
      ctx.fillStyle = textColor;
      ctx.fillText('「 Stand Name 」', 40, 40);
      ctx.fillText(name, 40, 96);
      ctx.fillText('「 Stand Master 」', width - 400, height - 144);
      ctx.fillText(master, width - 400, height - 88);

      const radarPlotBgImg = new Image();
      const radarPlotCoords = [80, height - 300];

      radarPlotBgImg.src = radarPlotBg;
      radarPlotBgImg.onload = () => {
        ctx.drawImage(
          radarPlotBgImg,
          radarPlotCoords[0],
          radarPlotCoords[1],
          256,
          256
        );
      };

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ff0000';

      const maxRadius = (256 * radarRadiusCoefficient) / 2;
      const stats = [durability, precision, potential, power, speed, range];

      ctx.beginPath();

      const radarPlotCenterCoords = [
        radarPlotCoords[0] + 128,
        radarPlotCoords[1] + 128
      ];

      for (let i = 5; i >= 0; i--) {
        const startAngle = (i / 6) * 360;
        const endAngle = ((i + 1) / 6) * 360;
        const radius = maxRadius * (stats[i] / 6);
        const nextRadius =
          maxRadius * (stats[i + 1 === stats.length ? 0 : i + 1] / 6);

        const x1 =
          radarPlotCenterCoords[0] + Math.sin(-startAngle * RADIAN) * radius;
        const y1 =
          radarPlotCenterCoords[1] + Math.cos(-startAngle * RADIAN) * radius;
        const x2 =
          radarPlotCenterCoords[0] + Math.sin(-endAngle * RADIAN) * nextRadius;
        const y2 =
          radarPlotCenterCoords[1] + Math.cos(-endAngle * RADIAN) * nextRadius;

        if (i === 0) {
          ctx.moveTo(x1, y1);
        }
        ctx.lineTo(x2, y2);

        console.dir(`${x1} ${y1} to ${x2} ${y2}`);
      }

      ctx.fillStyle = '#ff0000';
      ctx.fill();
    }
  });
  const handleNewBackground = useCallback(
    () => setBackgroundIndex(Math.ceil(Math.random() * BACKGROUND_COUNT)),
    []
  );

  useEffect(() => {
    async function loadNewImage() {
      const imageSrc = (await import(`../images/${backgroundIndex}.png`))
        .default;
      const averager = new FastAverageColor();
      const { hex } = await averager.getColorAsync(imageSrc);

      setBackgroundSrc(imageSrc);
      setTextColor(
        contrastColor({
          bgColor: hex
        })
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
        ref={containerRef}
        style={{
          backgroundPosition: '50% 50%',
          backgroundImage: `url("${backgroundSrc}")`,
          maxWidth: 1280,
          height: 696
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>
      &nbsp;
    </Fragment>
  );
}
