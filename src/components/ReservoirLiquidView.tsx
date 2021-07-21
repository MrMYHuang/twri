import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { liquidFillGaugeDefaultSettings, loadLiquidFillGauge } from '../liquidFillGauge';
import { withIonLifeCycle } from '@ionic/react';
import { DailyOperationalStatisticsOfReservoir } from '../models/DailyOperationalStatisticsOfReservoir';
import './ReservoirLiquidView.css';

interface Props {
  info: DailyOperationalStatisticsOfReservoir;
}

interface PageProps extends Props, RouteComponentProps<{
}> { }

interface State {
}

class _ReservoirLiquidView extends React.Component<PageProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
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
    loadLiquidFillGauge(
      `fillgauge${this.props.info.ReservoirIdentifier}`,
      EffectiveWaterStorageCapacityPercent.toFixed(1),
      liquidViewConfig
    );
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

  render() {
    return (
      <div className='Reservoir'>
        <div className='uiFont title'>{this.props.info.ReservoirName}</div>
        <div className='title'>
          <svg id={`fillgauge${this.props.info.ReservoirIdentifier}`} width="250" height="250"></svg>
        </div>
        <div className='uiFont'>有效蓄水量：{this.props.info.latestWaterData?.EffectiveWaterStorageCapacity}萬立方公尺</div>
        <div className='uiFont'>觀測時間：{this.props.info.latestWaterData?.ObservationTime}</div>
      </div>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
  }
};

//const mapDispatchToProps = {};

const ReservoirLiquidView = withIonLifeCycle(_ReservoirLiquidView);

export default connect(
  mapStateToProps,
)(ReservoirLiquidView);
