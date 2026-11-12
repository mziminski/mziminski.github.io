export type DiagramNode = {
  id: string;
  index: string;
  title: string;
  lines: [string, string];
  x: number;
  y: number;
};

export type DiagramModel = {
  title: string;
  caption: string;
  nodes: DiagramNode[];
  edges: { from: string; to: string }[];
  steps: { title: string; text: string }[];
};

const col = [8, 284, 560];
const row = [8, 148];

function node(
  id: string,
  index: string,
  title: string,
  lines: [string, string],
  column: 0 | 1 | 2,
  line: 0 | 1,
): DiagramNode {
  return { id, index, title, lines, x: col[column], y: row[line] };
}

export const diagramSize = { width: 788, height: 260, nodeWidth: 220, nodeHeight: 104 };

export const diagrams = {
  'smoke-trails': {
    title: 'Smoke × trails: from two layers to a condition a person can read',
    caption:
      'The drawing and the list are the same six steps. On a small screen, scroll the drawing sideways or read the list.',
    nodes: [
      node('smoke', '01', 'Smoke polygons', ['Sample plume outlines', 'Density, not a forecast'], 0, 0),
      node('trails', '02', 'Trail segments', ['Status lives on a piece', 'Not on the trail name'], 0, 1),
      node('clean', '03', 'Snap and clean', ['One CRS, no empties', 'Keep the refusal count'], 1, 0),
      node('join', '04', 'Spatial join', ['Length inside the plume', 'Not a yes-or-no flag'], 1, 1),
      node('rule', '05', 'Condition rule', ['Open, caution, closed', 'Thresholds you can read'], 2, 0),
      node('publish', '06', 'Map and list', ['Two views, one record', 'The list stands alone'], 2, 1),
    ],
    edges: [
      { from: 'smoke', to: 'clean' },
      { from: 'trails', to: 'clean' },
      { from: 'clean', to: 'join' },
      { from: 'join', to: 'rule' },
      { from: 'rule', to: 'publish' },
    ],
    steps: [
      {
        title: 'Smoke polygons',
        text: 'Plume outlines carry a density class. In this portfolio the outlines are sample geometry, not a forecast.',
      },
      {
        title: 'Trail segments',
        text: 'A long trail is split where the overlap changes. The name of the trail is not the thing that receives a status.',
      },
      {
        title: 'Snap and clean',
        text: 'Both layers land in one CRS. Empty and invalid geometries are refused and counted, not dropped quietly.',
      },
      {
        title: 'Spatial join',
        text: 'The join keeps how much of the segment sits inside the plume. A boolean overlap hides the partial case.',
      },
      {
        title: 'Condition rule',
        text: 'Open, caution, and closed come from thresholds a person can edit. A model may suggest a threshold. It does not invent a status.',
      },
      {
        title: 'Map and list',
        text: 'The map and the list are two views of one feature set. If the basemap fails, the list still answers the question.',
      },
    ],
  },
  'agent-evals': {
    title: 'An agent that can act only after the harness agrees',
    caption: 'Side effects sit behind the gate. The planner is not allowed to skip the eval run.',
    nodes: [
      node('task', '01', 'Task intake', ['A case with a budget', 'Goal, tools, stop rule'], 0, 0),
      node('planner', '02', 'Planner', ['Next step only', 'No side effects'], 0, 1),
      node('router', '03', 'Tool router', ['Named tools, timeouts', 'A timeout is a result'], 1, 0),
      node('workers', '04', 'Workers', ['Retrieve, map, draft', 'Every call is a trace'], 1, 1),
      node('eval', '05', 'Eval run', ['Fixed cases, same seed', 'Outcome and trajectory'], 2, 0),
      node('gate', '06', 'Release gate', ['A missing score fails', 'A person does the write'], 2, 1),
    ],
    edges: [
      { from: 'task', to: 'planner' },
      { from: 'planner', to: 'router' },
      { from: 'router', to: 'workers' },
      { from: 'workers', to: 'eval' },
      { from: 'eval', to: 'gate' },
    ],
    steps: [
      {
        title: 'Task intake',
        text: 'A case names the goal, the tools that are allowed, and the budget. If those are missing, the run does not start.',
      },
      {
        title: 'Planner',
        text: 'The planner proposes the next step. It does not file, send, or edit. Those are writes, and writes are later.',
      },
      {
        title: 'Tool router',
        text: 'Only named tools are callable. A timeout is stored as a result, not retried until the budget is gone.',
      },
      {
        title: 'Workers',
        text: 'Retrieve, map, and draft are separate calls. Each call lands in the trace with its inputs and its output.',
      },
      {
        title: 'Eval run',
        text: 'A fixed set of cases is replayed. Scorers look at the outcome and at the trajectory, so a right sentence via a forbidden tool still fails.',
      },
      {
        title: 'Release gate',
        text: 'A missing or errored score does not pass. Anything that leaves the system waits for a person.',
      },
    ],
  },
  'spatial-pipeline': {
    title: 'A spatial pipeline that fails where the geometry fails',
    caption: 'Publish is the last box. A golden-area miss stops the run before that box.',
    nodes: [
      node('land', '01', 'Land the file', ['Bytes, name, and time', 'Before any parsing'], 0, 0),
      node('schema', '02', 'Schema check', ['Columns and types', 'Refuse the row, count it'], 0, 1),
      node('geom', '03', 'Geometry check', ['Valid, closed, in bounds', 'CRS is written down'], 1, 0),
      node('transform', '04', 'Transform', ['Reproject, then tile', 'Version the output'], 1, 1),
      node('golden', '05', 'Golden area', ['Known ids and extents', 'A surprise stops publish'], 2, 0),
      node('dash', '06', 'Dashboard', ['Freshness and refusals', 'A missed run is a page'], 2, 1),
    ],
    edges: [
      { from: 'land', to: 'schema' },
      { from: 'schema', to: 'geom' },
      { from: 'geom', to: 'transform' },
      { from: 'transform', to: 'golden' },
      { from: 'golden', to: 'dash' },
    ],
    steps: [
      {
        title: 'Land the file',
        text: 'The object store records the bytes, the name, and the arrival time before a parser is allowed to touch them.',
      },
      {
        title: 'Schema check',
        text: 'Columns and types are checked per row. A refused row increments a counter that the dashboard shows.',
      },
      {
        title: 'Geometry check',
        text: 'Invalid, empty, and out-of-bounds geometries are counted on their own. The CRS is a field in the run record.',
      },
      {
        title: 'Transform',
        text: 'Reprojection and tiling write a new version. They do not overwrite the version that is live.',
      },
      {
        title: 'Golden area',
        text: 'A small set of features with known ids and extents is compared every run. A surprise stops publish.',
      },
      {
        title: 'Dashboard',
        text: 'One page shows freshness, refusals, join loss, and publish lag. A run that never started is an alert, not a blank.',
      },
    ],
  },
  'feedback-triage': {
    title: 'A draft can be fluent and still wait for a person',
    caption: 'The GitHub write is a separate box. Only approval can reach it.',
    nodes: [
      node('note', '01', 'Feedback note', ['The original stays put', 'It is not the prompt'], 0, 0),
      node('redact', '02', 'Redaction', ['Strip tokens, contacts', 'Reviewer can see raw'], 0, 1),
      node('class', '03', 'Classify', ['A fixed label set', 'No invented priority'], 1, 0),
      node('draft', '04', 'Draft issue', ['Title, area, reason', 'Duplicates are hints'], 1, 1),
      node('queue', '05', 'Admin queue', ['Edit, reject, approve', 'Timeout is not approval'], 2, 0),
      node('write', '06', 'GitHub write', ['Only approval calls', 'Token can open, not admin'], 2, 1),
    ],
    edges: [
      { from: 'note', to: 'redact' },
      { from: 'redact', to: 'class' },
      { from: 'class', to: 'draft' },
      { from: 'draft', to: 'queue' },
      { from: 'queue', to: 'write' },
    ],
    steps: [
      {
        title: 'Feedback note',
        text: 'The note is stored as it arrived. That copy is for the reviewer. It is not what the model sees by default.',
      },
      {
        title: 'Redaction',
        text: 'Emails, tokens, and phone-shaped strings are stripped before classification. The reviewer can still open the original.',
      },
      {
        title: 'Classify',
        text: 'The label set is fixed. The model does not assign a priority that pages someone.',
      },
      {
        title: 'Draft issue',
        text: 'The draft is a title, a suspected area, and a reason. A similar open issue is a suggestion, not a merge.',
      },
      {
        title: 'Admin queue',
        text: 'A person edits, rejects, or approves. Silence does not become approval.',
      },
      {
        title: 'GitHub write',
        text: 'The API call exists only on the approval action. The token can open an issue in one repository and nothing else.',
      },
    ],
  },
  'on-device-sensing': {
    title: 'Samples stay on the phone unless a person exports them',
    caption: 'The eval set is a build check beside the model. It is not a step the person at the phone has to wait on.',
    nodes: [
      node('sensors', '01', 'Sensors', ['Motion and health types', 'A reason per permission'], 0, 0),
      node('buffer', '02', 'On-device buffer', ['Window, then features', 'Raw samples stay local'], 0, 1),
      node('model', '03', 'Local model', ['Runs without a network', 'A gap stays a gap'], 1, 0),
      node('eval', '04', 'Device eval', ['A small consented set', 'A regression fails CI'], 1, 1),
      node('store', '05', 'Local store', ['The summary lives here', 'No default upload'], 2, 0),
      node('export', '06', 'Explicit export', ['A person confirms', 'Features, plus version'], 2, 1),
    ],
    edges: [
      { from: 'sensors', to: 'buffer' },
      { from: 'buffer', to: 'model' },
      { from: 'model', to: 'eval' },
      { from: 'model', to: 'store' },
      { from: 'store', to: 'export' },
    ],
    steps: [
      {
        title: 'Sensors',
        text: 'Each permission names the sample type and why the summary needs it. Nothing is requested for a later idea.',
      },
      {
        title: 'On-device buffer',
        text: 'A window becomes features. Raw samples are not the interface another layer is allowed to call.',
      },
      {
        title: 'Local model',
        text: 'The rule or model runs on the device. If samples drop out, the summary shows the gap instead of filling it.',
      },
      {
        title: 'Device eval',
        text: 'A small labeled set, collected with consent, runs against device builds. This page does not claim that set exists yet.',
      },
      {
        title: 'Local store',
        text: 'The summary is stored on the device. Upload is not the default path of the buffer.',
      },
      {
        title: 'Explicit export',
        text: 'Export is a confirmed action. If it sends anything, it sends features and the extractor version, not the raw window.',
      },
    ],
  },
} as const satisfies Record<string, DiagramModel>;

export type DiagramName = keyof typeof diagrams;
