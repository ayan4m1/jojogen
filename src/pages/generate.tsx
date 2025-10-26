import { useFormik } from 'formik';
import getImageSize from 'image-size';
import { contrastColor } from 'contrast-color';
import { Button, Card, Form } from 'react-bootstrap';
import { FastAverageColor } from 'fast-average-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice, faRefresh } from '@fortawesome/free-solid-svg-icons';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import { StandForm } from '../types';
import radarPlotBg from '../images/radar-plot-bg.svg';
import { BACKGROUND_COUNT, bufferToImageString, getPageTitle } from '../utils';

const radarPlotSize = 256;
const radarRadiusCoefficient = 0.567;
const RADIAN = Math.PI / 180;

export function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState<string>(null);
  const [textColor, setTextColor] = useState<string>(null);
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const [radarPlotSrc, setRadarPlotSrc] = useState<string>(null);
  const [backgroundSrc, setBackgroundSrc] = useState<string>(null);
  const [imageSize, setImageSize] = useState<[number, number]>([0, 0]);
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

      const ctx = canvasRef.current.getContext('2d');
      const { width, height } = canvasRef.current;

      const image = new Image();

      image.onload = () => {
        const fitHeight = height - 104;
        const aspectRatio = imageSize[0] / imageSize[1];
        const newWidth = fitHeight * aspectRatio;
        const imageX = width / 2 - newWidth / 2;

        ctx.drawImage(image, imageX, 96, newWidth, fitHeight);

        ctx.font = '48px MS Trebuchet';
        ctx.fillStyle = textColor;
        ctx.textBaseline = 'top';

        ctx.fillText('「 Stand Name 」', 16, 40);
        ctx.fillText(name, 40, 96);
        ctx.textAlign = 'right';
        ctx.fillText('「 Stand Master 」', width - 54, height - 144);
        ctx.fillText(master, width - 80, height - 88);
      };
      image.src = imageSrc;

      const radarPlotCtx = radarCanvasRef.current.getContext('2d');
      const maxRadius = (radarPlotSize * radarRadiusCoefficient) / 2;
      const stats = [durability, precision, potential, power, speed, range];

      for (let i = 0; i < 6; i++) {
        const startAngle = (i / 6) * 360;
        const endAngle = ((i + 1) / 6) * 360;
        const radius = maxRadius * (stats[i] / 6);
        const nextRadius =
          maxRadius * (stats[i + 1 === stats.length ? 0 : i + 1] / 6);

        const x1 = radarPlotSize / 2 + Math.sin(-startAngle * RADIAN) * radius;
        const y1 = radarPlotSize / 2 + Math.cos(-startAngle * RADIAN) * radius;
        const x2 =
          radarPlotSize / 2 + Math.sin(-endAngle * RADIAN) * nextRadius;
        const y2 =
          radarPlotSize / 2 + Math.cos(-endAngle * RADIAN) * nextRadius;

        if (i === 0) {
          radarPlotCtx.moveTo(x1, y1);
        }

        radarPlotCtx.lineTo(x2, y2);
      }

      radarPlotCtx.fillStyle = '#ff0000';
      radarPlotCtx.fill();
    }
  });
  const handleNewBackground = useCallback(
    () => setBackgroundIndex(Math.ceil(Math.random() * BACKGROUND_COUNT)),
    []
  );
  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target;

      if (files.length) {
        const file = files.item(0);
        const bytes = await file.bytes();
        const { width, height } = getImageSize(bytes);

        setImageSrc(bufferToImageString(bytes));
        setImageSize([width, height]);
      }
    },
    []
  );

  useEffect(() => {
    async function loadNewImage() {
      const imageSrc = (await import(`../images/${backgroundIndex}.png`))
        .default;
      const averager = new FastAverageColor();
      const { hex } = await averager.getColorAsync(imageSrc, {
        width: 400,
        height: 300
      });
      const newTextColor = contrastColor({
        bgColor: hex
      });

      setBackgroundSrc(imageSrc);
      setTextColor(newTextColor);
      setRadarPlotSrc(radarPlotBg.replace(/#000000/g, `${newTextColor}`));
    }

    loadNewImage();
  }, [backgroundIndex]);

  useEffect(() => {});

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
          <Form.Group>
            <Form.Label>Stand Image</Form.Label>
            <Form.Control
              name="image"
              onChange={handleFileChange}
              type="file"
            />
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
            position: 'relative',
            top: 0,
            width: '100%',
            height: '100%'
          }}
        />
        <canvas
          height={radarPlotSize}
          id="radarPlot"
          ref={radarCanvasRef}
          style={{
            float: 'left',
            position: 'relative',
            left: 80,
            bottom: radarPlotSize + 80
          }}
          width={radarPlotSize}
        ></canvas>
        <svg
          dangerouslySetInnerHTML={{ __html: radarPlotSrc }}
          height={radarPlotSize}
          style={{
            position: 'relative',
            left: -176,
            bottom: radarPlotSize + 80
          }}
          viewBox="0 0 79 79"
          width={radarPlotSize}
        />
      </div>
      &nbsp;
    </Fragment>
  );
}
