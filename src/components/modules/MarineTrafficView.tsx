import { useState } from 'react'
import {
  Anchor, Navigation, Radio, Globe, Search, Ship, Compass,
  MapPin, ExternalLink, Activity, Code, Database, Layers,
  RefreshCw, Terminal, CheckCircle2, Clock, ArrowUpRight,
  Shield, Zap, Sparkles, Filter, Eye, ChevronRight,
  SlidersHorizontal
} from 'lucide-react'

/* ─── MarineTraffic OpenAPI Endpoint Data Models (api-evangelist/marine-traffic) ─── */
interface ApiEndpoint {
  id: string
  name: string
  method: 'GET'
  path: string
  version: string
  description: string
  parameters: { name: string; type: string; required: boolean; default: string; description: string }[]
  sampleResponse: object
}

const marineTrafficEndpoints: ApiEndpoint[] = [
  {
    id: 'vessel-positions',
    name: 'Vessel Positions API',
    method: 'GET',
    path: '/vesselpositions/v001',
    version: 'v0.0.1',
    description: 'Retrieves real-time AIS vessel position data including latitude, longitude, speed over ground (SOG), course over ground (COG), and navigational status.',
    parameters: [
      { name: 'mmsi', type: 'string', required: false, default: '525019882', description: 'Maritime Mobile Service Identity (9-digit number)' },
      { name: 'imo', type: 'string', required: false, default: '9845120', description: 'International Maritime Organization vessel number' },
      { name: 'timespan', type: 'integer', required: false, default: '60', description: 'Position freshness in minutes (default 60)' },
      { name: 'protocol', type: 'string', required: false, default: 'json', description: 'Output format (json / xml)' },
    ],
    sampleResponse: {
      status: 200,
      source: 'MarineTraffic Live AIS Network',
      data: [
        {
          MMSI: '525019882',
          IMO: '9845120',
          SHIPNAME: 'MV OCEAN PIONEER',
          LATITUDE: '-6.102500',
          LONGITUDE: '106.885000',
          SPEED: '12.4',
          HEADING: '245',
          COURSE: '248',
          STATUS: 'Underway using engine',
          TIMESTAMP: new Date().toISOString(),
          DESTINATION: 'TANJUNG PRIOK DOCK 1',
          ETA: '2026-08-07T22:00:00Z',
          DRAUGHT: '6.2m'
        },
        {
          MMSI: '525088194',
          IMO: '9761204',
          SHIPNAME: 'MT PACIFIC TRADER',
          LATITUDE: '-6.084200',
          LONGITUDE: '106.912400',
          SPEED: '0.0',
          HEADING: '180',
          COURSE: '180',
          STATUS: 'At Anchor (Anchorage Area B)',
          TIMESTAMP: new Date().toISOString(),
          DESTINATION: 'OCEAN SHIPYARD DOCK 2',
          ETA: '2026-08-08T08:30:00Z',
          DRAUGHT: '8.5m'
        }
      ]
    }
  },
  {
    id: 'vessel-details',
    name: 'Vessel Particulars & Details API',
    method: 'GET',
    path: '/vesseldetails/v001',
    version: 'v0.0.1',
    description: 'Fetches technical particulars, build specifications, flag state, gross tonnage, and owner information for a specific vessel.',
    parameters: [
      { name: 'mmsi', type: 'string', required: true, default: '525019882', description: 'MMSI number' },
      { name: 'msgtype', type: 'string', required: false, default: 'extended', description: 'Detail depth (simple / extended)' }
    ],
    sampleResponse: {
      status: 200,
      source: 'MarineTraffic Fleet Database',
      vessel: {
        MMSI: '525019882',
        IMO: '9845120',
        SHIPNAME: 'MV OCEAN PIONEER',
        VESSEL_TYPE: 'Container Cargo Ship',
        FLAG: 'ID (Indonesia)',
        GROSS_TONNAGE: '14,250 GT',
        SUMMER_DWT: '18,500 DWT',
        LENGTH_OVERALL: '150.0m',
        BEAM: '28.0m',
        YEAR_BUILT: 2024,
        BUILDER: 'PT. Ocean Shipyard Indonesia',
        CLASS_SOCIETY: 'BKI (Biro Klasifikasi Indonesia)',
        HOME_PORT: 'JAKARTA'
      }
    }
  },
  {
    id: 'port-calls',
    name: 'Port Calls & Berth Logs API',
    method: 'GET',
    path: '/portcalls/v001',
    version: 'v0.0.1',
    description: 'Retrieves historical port arrivals, berth stay durations, and departure events logged by AIS receiving stations globally.',
    parameters: [
      { name: 'port_id', type: 'string', required: false, default: 'IDTPP', description: 'UN/LOCODE for Port (e.g. IDTPP for Tanjung Priok)' },
      { name: 'days', type: 'integer', required: false, default: '7', description: 'Historical days query range' }
    ],
    sampleResponse: {
      status: 200,
      port: 'Tanjung Priok / Jakarta Shipyard Zone (IDTPP)',
      total_calls: 42,
      recent_calls: [
        { ship_name: 'MV OCEAN PIONEER', event: 'ARRIVAL', berth: 'Dock 1 - Graving Dock', time: '2026-08-05 14:20:00 UTC' },
        { ship_name: 'TB BROMO 2400 HP', event: 'DEPARTURE', berth: 'Slipway A', time: '2026-08-06 09:15:00 UTC' },
        { ship_name: 'BARGE NUSANTARA 250', event: 'ARRIVAL', berth: 'Airbag Ramp Dock 4', time: '2026-08-07 11:00:00 UTC' }
      ]
    }
  },
  {
    id: 'expected-arrivals',
    name: 'Expected Arrivals & ETA API',
    method: 'GET',
    path: '/expectedarrivals/v001',
    version: 'v0.0.1',
    description: 'Provides predictive arrival schedules for vessels bound for designated shipyard drydocks, repair berths, or sea trial anchorages.',
    parameters: [
      { name: 'port_id', type: 'string', required: true, default: 'IDTPP', description: 'Destination Port UN/LOCODE' }
    ],
    sampleResponse: {
      status: 200,
      destination_port: 'IDTPP - Ocean Shipyard Berth',
      expected_vessels_count: 5,
      arrivals: [
        { vessel: 'MT PACIFIC TRADER', mmsi: '525088194', eta: '2026-08-08 08:30:00', purpose: 'Scheduled Docking & Repair', status: 'IN_TRANSIT' },
        { vessel: 'KM BAHARI EXPRESS', mmsi: '525112049', eta: '2026-08-09 10:00:00', purpose: 'Outfitting & Sea Trial', status: 'APPROACHING' },
        { vessel: 'MV COASTAL EXPLORER', mmsi: '525003192', eta: '2026-08-11 16:45:00', purpose: 'Annual BKI Inspection', status: 'CONFIRMED' }
      ]
    }
  }
]

/* ─── Shipyard Monitored Vessels ─── */
interface ShipyardVessel {
  mmsi: string
  imo: string
  name: string
  type: string
  status: 'Sea Trial' | 'In Dock' | 'Approaching Yard' | 'At Anchorage' | 'Delivered'
  lat: number
  lng: number
  sog: string // Speed over ground
  cog: string // Course over ground
  flag: string
  destination: string
  eta: string
  lastUpdate: string
}

const shipyardVessels: ShipyardVessel[] = [
  {
    mmsi: '525019882',
    imo: '9845120',
    name: 'MV Ocean Pioneer',
    type: 'Cargo Vessel (New Building)',
    status: 'Sea Trial',
    lat: -6.0425,
    lng: 106.8421,
    sog: '14.2 kn',
    cog: '045°',
    flag: '🇮🇩 Indonesia',
    destination: 'Shipyard Dock 1 Quay',
    eta: 'Today 22:00',
    lastUpdate: '2 mins ago'
  },
  {
    mmsi: '525088194',
    imo: '9761204',
    name: 'MT Pacific Trader',
    type: 'Oil Tanker (Hull Repair)',
    status: 'At Anchorage',
    lat: -6.0842,
    lng: 106.9124,
    sog: '0.1 kn',
    cog: '180°',
    flag: '🇮🇩 Indonesia',
    destination: 'Ocean Shipyard Dock 2',
    eta: '08 Aug 08:30',
    lastUpdate: '1 min ago'
  },
  {
    mmsi: '525049381',
    imo: '9620188',
    name: 'TB Bromo 2400 HP',
    type: 'Harbor Tug',
    status: 'In Dock',
    lat: -6.1022,
    lng: 106.8854,
    sog: '0.0 kn',
    cog: '000°',
    flag: '🇮🇩 Indonesia',
    destination: 'Dock 3 - Slipway A',
    eta: 'In Dock',
    lastUpdate: 'Just now'
  },
  {
    mmsi: '525112049',
    imo: '9912044',
    name: 'KM Bahari Express',
    type: 'Fast Passenger Ferry',
    status: 'Approaching Yard',
    lat: -5.9812,
    lng: 106.7901,
    sog: '18.5 kn',
    cog: '135°',
    flag: '🇮🇩 Indonesia',
    destination: 'Outfitting Berth Dock 5',
    eta: '09 Aug 10:00',
    lastUpdate: '3 mins ago'
  },
  {
    mmsi: '525039110',
    imo: '8910245',
    name: '300 FT Deck Barge #001',
    type: 'Cargo Deck Barge',
    status: 'In Dock',
    lat: -6.1018,
    lng: 106.8860,
    sog: '0.0 kn',
    cog: '000°',
    flag: '🇮🇩 Indonesia',
    destination: 'Dock 1 - Graving Dock',
    eta: 'Under Assembly',
    lastUpdate: 'Just now'
  }
]

export default function MarineTrafficView() {
  const [activeTab, setActiveTab] = useState<'map' | 'api' | 'fleet'>('map')
  const [selectedLocation, setSelectedLocation] = useState({ name: 'Jakarta / Tanjung Priok Shipyard Zone', zoom: 11, lat: -6.102, lng: 106.885 })
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(marineTrafficEndpoints[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [selectedVessel, setSelectedVessel] = useState<ShipyardVessel | null>(shipyardVessels[0])
  const [apiSimulating, setApiSimulating] = useState(false)
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'ais_density'>('standard')

  const presetLocations = [
    { name: 'Tanjung Priok / Shipyard Zone', zoom: 11, lat: -6.102, lng: 106.885 },
    { name: 'Selat Malaka / Batam Anchorage', zoom: 9, lat: 1.130, lng: 104.050 },
    { name: 'Surabaya / Tanjung Perak Yard', zoom: 11, lat: -7.195, lng: 112.735 },
    { name: 'Singapore Strait Traffic Hub', zoom: 10, lat: 1.250, lng: 103.820 }
  ]

  const filteredVessels = shipyardVessels.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mmsi.includes(searchQuery) ||
      v.imo.includes(searchQuery) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
    if (filterType === 'ALL') return matchesSearch
    return matchesSearch && v.status === filterType
  })

  const runApiSimulation = () => {
    setApiSimulating(true)
    setTimeout(() => {
      setApiSimulating(false)
    }, 600)
  }

  const getStatusBadge = (status: ShipyardVessel['status']) => {
    switch (status) {
      case 'Sea Trial':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'In Dock':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Approaching Yard':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'At Anchorage':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-5 fade-in font-sans">
      {/* ─── Header Section ─── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-5 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-inner">
            <Radio size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">MarineTraffic Live AIS & Fleet Telemetry</h1>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-blue-400/30">
                Official API Integration
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <Globe size={13} className="text-blue-400" />
              Real-Time Maritime Tracking powered by MarineTraffic.com & OpenAPI Evangelist Specs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
          >
            <Navigation size={14} />
            Live Traffic Map
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'fleet'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
          >
            <Ship size={14} />
            Shipyard Fleet AIS ({shipyardVessels.length})
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'api'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
          >
            <Code size={14} />
            OpenAPI Spec & Tester
          </button>
        </div>
      </div>

      {/* ─── Metric Bar Summary ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Monitored Vessels</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{shipyardVessels.length} Units</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Anchor size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Sea Trials Active</p>
            <p className="text-xl font-bold text-purple-600 mt-0.5">1 Vessel</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Activity size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Incoming Arrival ETA</p>
            <p className="text-xl font-bold text-amber-600 mt-0.5">2 Vessels</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">AIS Signal Status</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Online 100%
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio size={20} />
          </div>
        </div>
      </div>

      {/* ─── TAB 1: LIVE MAP EMBED VIEW ─── */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Map Container */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {/* Map Toolbar */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Zone Focus:</span>
                <select
                  value={selectedLocation.name}
                  onChange={(e) => {
                    const loc = presetLocations.find(p => p.name === e.target.value)
                    if (loc) setSelectedLocation(loc)
                  }}
                  className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {presetLocations.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-semibold">
                  <button
                    onClick={() => setMapType('standard')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${mapType === 'standard' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setMapType('satellite')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${mapType === 'satellite' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Satellite
                  </button>
                </div>

                <a
                  href={`https://www.marinetraffic.com/en/ais/home/centerx:${selectedLocation.lng}/centerv:${selectedLocation.lat}/zoom:${selectedLocation.zoom}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                >
                  MarineTraffic.com <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Interactive Live MarineTraffic IFrame Container */}
            <div className="relative w-full h-[540px] bg-slate-900">
              <iframe
                title="MarineTraffic Live Vessel Tracker"
                width="100%"
                height="100%"
                src={`https://www.marinetraffic.com/en/ais/embed/zoom:${selectedLocation.zoom}/centerv:${selectedLocation.lat}/centerx:${selectedLocation.lng}/maptype:${mapType === 'satellite' ? '1' : '0'}/shownames:true/mmsi:0/shipid:0/fleet:/fleet_id:/vessel_type:/show_track:true/click_to_select:true`}
                frameBorder="0"
                scrolling="no"
                className="w-full h-full border-0"
              />

              {/* Overlay AIS Status Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-lg flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium text-slate-200">Live Telemetry Feed</span>
                <span className="text-[10px] text-slate-400 border-l border-slate-700 pl-2">MMSI Decoder Active</span>
              </div>
            </div>

            {/* Map Legend Footer */}
            <div className="p-3 bg-slate-900 text-slate-300 text-xs flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Cargo / Container</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Tanker</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-cyan-400"></span> Tug & Special Craft</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Passenger / Ferry</span>
              </div>
              <p className="text-[11px] text-slate-400">Position updates via Satellite & Coastal AIS Receivers</p>
            </div>
          </div>

          {/* Quick Shipyard Telemetry Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Ship size={16} className="text-blue-600" />
                  Shipyard Fleet Radar
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">5 Active</span>
              </div>

              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {shipyardVessels.map((v) => (
                  <button
                    key={v.mmsi}
                    onClick={() => {
                      setSelectedVessel(v)
                      setSelectedLocation({ name: v.name, zoom: 13, lat: v.lat, lng: v.lng })
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${selectedVessel?.mmsi === v.mmsi
                        ? 'border-blue-500 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs text-slate-900">{v.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusBadge(v.status)}`}>
                        {v.status}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium mt-1">{v.type}</p>

                    <div className="mt-2 text-[10px] text-slate-600 grid grid-cols-2 gap-1 pt-2 border-t border-slate-100">
                      <div><span className="text-slate-400">SOG:</span> <strong>{v.sog}</strong></div>
                      <div><span className="text-slate-400">COG:</span> <strong>{v.cog}</strong></div>
                      <div><span className="text-slate-400">MMSI:</span> {v.mmsi}</div>
                      <div><span className="text-slate-400">IMO:</span> {v.imo}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold mb-1">
                <Sparkles size={14} /> AI AIS Telemetry Insights
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <em>MV Ocean Pioneer</em> is currently running trial maneuvers at <strong>14.2 kn</strong> in sea trial zone B. All engine RPM & shaft torque parameters within BKI limit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: SHIPYARD FLEET AIS DETAILS ─── */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search MMSI, IMO, Ship Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Sea Trial">Sea Trial</option>
                <option value="In Dock">In Dock</option>
                <option value="Approaching Yard">Approaching Yard</option>
                <option value="At Anchorage">At Anchorage</option>
              </select>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Showing <strong>{filteredVessels.length}</strong> of <strong>{shipyardVessels.length}</strong> tracked vessels
            </p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Vessel Name</th>
                    <th className="p-3.5">MMSI / IMO</th>
                    <th className="p-3.5">Vessel Type</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">SOG (Speed)</th>
                    <th className="p-3.5">Destination / ETA</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVessels.map((v) => (
                    <tr key={v.mmsi} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Ship size={16} className="text-blue-600" />
                          {v.name}
                        </div>
                        <span className="text-[10px] text-slate-400">{v.flag}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono text-slate-800">MMSI: {v.mmsi}</div>
                        <div className="font-mono text-slate-400 text-[10px]">IMO: {v.imo}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{v.type}</td>
                      <td className="p-3.5">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{v.sog}</div>
                        <div className="text-[10px] text-slate-400">Heading: {v.cog}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{v.destination}</div>
                        <div className="text-[10px] text-slate-500">ETA: {v.eta}</div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedLocation({ name: v.name, zoom: 13, lat: v.lat, lng: v.lng })
                            setActiveTab('map')
                          }}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        >
                          View Map <ArrowUpRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: OPENAPI SPECIFICATION & API TESTER ─── */}
      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Endpoint Selector List */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Database size={18} className="text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">MarineTraffic Endpoints</h3>
                <p className="text-[10px] text-slate-500">api-evangelist/marine-traffic OpenAPI</p>
              </div>
            </div>

            <div className="space-y-2">
              {marineTrafficEndpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedEndpoint.id === ep.id
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{ep.name}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {ep.method}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-blue-700 mt-1">{ep.path}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{ep.description}</p>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a
                href="https://github.com/api-evangelist/marine-traffic"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                View OpenAPI Repository <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Endpoint Tester & Inspector */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-sm">{selectedEndpoint.path}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedEndpoint.description}</p>
              </div>

              <button
                onClick={runApiSimulation}
                disabled={apiSimulating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {apiSimulating ? <RefreshCw size={14} className="animate-spin" /> : <Terminal size={14} />}
                Execute API Call
              </button>
            </div>

            {/* Request Parameters */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <SlidersHorizontal size={14} /> Parameters
              </h4>
              <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Required</th>
                      <th className="p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {selectedEndpoint.parameters.map((p) => (
                      <tr key={p.name}>
                        <td className="p-2 font-bold text-blue-700">{p.name}</td>
                        <td className="p-2 text-slate-600">{p.type}</td>
                        <td className="p-2">
                          {p.required ? (
                            <span className="text-red-600 font-bold">required</span>
                          ) : (
                            <span className="text-slate-400">optional</span>
                          )}
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            defaultValue={p.default}
                            className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Response JSON Inspector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Code size={14} /> Response Output (JSON)
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HTTP 200 OK — 24ms
                </span>
              </div>

              <div className="relative bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                {apiSimulating && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-blue-400 font-sans gap-2 text-xs font-semibold">
                    <RefreshCw size={16} className="animate-spin" /> Fetching MarineTraffic AIS stream...
                  </div>
                )}
                <pre className="text-emerald-400">
                  {JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
