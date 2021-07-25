import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { liquidFillGaugeDefaultSettings, loadLiquidFillGauge } from '../liquidFillGauge';
import { DailyOperationalStatisticsOfReservoir } from '../models/DailyOperationalStatisticsOfReservoir';
import { Settings } from '../models/Settings';
import './ReservoirLiquidView.css';
import { Bookmark } from '../models/Bookmark';
import { v4 } from 'uuid';

interface Props {
  info: DailyOperationalStatisticsOfReservoir;
  onIconClick: Function;
  dispatch: Function;
}

interface PageProps extends Props, RouteComponentProps<{
}> {
  settings: Settings;
}

interface State {
}

class _ReservoirLiquidView extends React.Component<PageProps, State> {
  id: string = 'id' + v4();
  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.updateLiquidIcon();
  }

  componentDidUpdate() {
    this.updateLiquidIcon();
  }

  updateLiquidIcon() {
    const EffectiveWaterStorageCapacityPercent = (this.props.info.latestWaterData?.EffectiveWaterStorageCapacity || 0) / this.props.info.EffectiveCapacity * 100;
    let liquidViewConfig = liquidFillGaugeDefaultSettings();
    if (EffectiveWaterStorageCapacityPercent >= 50) {
      this.setEnoughColor(liquidViewConfig);
    } else {
      this.setShortageColor(liquidViewConfig);
    }
    liquidViewConfig.circleThickness = 0.1;
    liquidViewConfig.textVertPosition = 0.5;
    liquidViewConfig.waveAnimateTime = 1000;
    liquidViewConfig.waveHeight = 0.05;
    liquidViewConfig.waveAnimate = true;
    liquidViewConfig.waveRise = false;
    liquidViewConfig.waveHeightScaling = true;
    liquidViewConfig.waveOffset = 0.25;
    liquidViewConfig.textSize = 0.75;
    liquidViewConfig.waveCount = 3;
    try {
        loadLiquidFillGauge(
          this.id,
          EffectiveWaterStorageCapacityPercent.toFixed(1),
          liquidViewConfig
        );
    } catch (error) {
      console.error(error);
    }
  }

  setEnoughColor(liquidViewConfig: any) {
    liquidViewConfig.circleColor = "#0080ff";
    liquidViewConfig.textColor = "#0080ff";
    liquidViewConfig.waveTextColor = "#ffffff";
    liquidViewConfig.waveColor = "#0080ff";
  }

  setShortageColor(liquidViewConfig: any) {
    liquidViewConfig.circleColor = "#ff0080";
    liquidViewConfig.textColor = "#ff0080";
    liquidViewConfig.waveTextColor = "#ffffff";
    liquidViewConfig.waveColor = "#ff0080";
  }

  getTime() {
    const date = new Date(this.props.info.latestWaterData?.ObservationTime ?? 0);
    return `${date.toLocaleDateString()}, ${date.getHours()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  }

  render() {
    return (
      <div className='Reservoir' style={{ width: `${this.props.settings.iconSize}px` }}>
        <div className='textFont title'>{this.props.info.ReservoirName}</div>
        <div className='title'>
          <svg id={this.id} width={`${this.props.settings.iconSize}px`} height={`${this.props.settings.iconSize}px`}
            onClick={e => {
              this.props.onIconClick(new Bookmark({
                ReservoirIdentifier: this.props.info.ReservoirIdentifier,
                ReservoirName: this.props.info.ReservoirName
              }));
            }}></svg>
        </div>
        <div className='textFontX0_8'>有效蓄水量：{Math.round(this.props.info.latestWaterData?.EffectiveWaterStorageCapacity || 0)}</div>
        <div className='textFontX0_8' hidden={!this.props.settings.showAllReservoirs}>有效容量：{Math.round(this.props.info.EffectiveCapacity || 0)}</div>
        <div className='textFontX0_8'>觀測時間：{this.getTime()}</div>
      </div>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
    settings: state.settings
  }
};

//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(_ReservoirLiquidView);
