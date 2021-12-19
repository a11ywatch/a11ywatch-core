interface Props {
  statusColor: string;
  score?: number;
}

export const rawStatusBadge = ({
  statusColor,
  score,
}: Props) => `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="20">
<linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
</linearGradient>
<mask id="a">
    <rect width="112" height="20" rx="3" fill="#fff"/>
</mask>
<g mask="url(#a)">
    <path fill="#555" d="M0 0h76v20H0z"/>
    <path fill="${statusColor}" d="M76 0h36v20H76z"/>
    <path fill="url(#b)" d="M0 0h112v20H0z"/>
</g>
<g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="46" y="15" fill="#010101" fill-opacity=".3">a11y</text>
    <text x="46" y="14">a11y</text>
    <text x="93" y="15" fill="#010101" fill-opacity=".3">${score ?? 0}%</text>
    <text x="93" y="14">${score ?? 0}%</text>
</g>
<svg viewBox="305 -40 160 160">
  <path fill="#fff" d="m132.83 33.626c-14.989-16.515-39.858-33.972-64.802-33.621-24.943-0.35754-49.813 17.111-64.807 33.621-2.0554 2.3006-3.1917 5.2789-3.1917 8.3655 0 3.0865 1.1363 6.0648 3.1917 8.3654 14.813 16.339 39.337 33.643 63.894 33.643h1.746c24.643 0 49.156-17.304 63.986-33.649 2.052-2.3018 3.185-5.2802 3.182-8.3658s-1.142-6.0618-3.199-8.3594zm-90.879 8.3768c0-5.1634 1.5294-10.211 4.3948-14.504 2.8654-4.2931 6.9381-7.6393 11.703-9.6152 4.765-1.9759 10.008-2.4929 15.067-1.4856 5.0584 1.0073 9.7049 3.4937 13.352 7.1448 3.6469 3.651 6.1305 8.3027 7.1367 13.367 1.0062 5.0641 0.4898 10.313-1.4839 15.084s-5.3161 8.8476-9.6045 11.716c-4.2883 2.8686-9.33 4.3997-14.488 4.3997-6.9161 0-13.549-2.7505-18.439-7.6464s-7.6378-11.536-7.6378-18.46z"/>
</svg>
</svg>`;
