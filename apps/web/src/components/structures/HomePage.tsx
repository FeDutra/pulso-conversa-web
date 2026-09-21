/*
Copyright 2024 New Vector Ltd.
Copyright 2020 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { useState } from "react";
import { AutoHideScrollbar } from "@element-hq/web-shared-components";

import { getHomePageUrl } from "../../utils/pages";
import SdkConfig from "../../SdkConfig";
import dis from "../../dispatcher/dispatcher";
import { Action } from "../../dispatcher/actions";
import { OwnProfileStore } from "../../stores/OwnProfileStore";
import AccessibleButton, { type ButtonEvent } from "../views/elements/AccessibleButton";
import { UPDATE_EVENT } from "../../stores/AsyncStore";
import { useEventEmitter } from "../../hooks/useEventEmitter";
import { useMatrixClientContext } from "../../contexts/MatrixClientContext";
import PosthogTrackers from "../../PosthogTrackers";
import EmbeddedPage from "./EmbeddedPage";

const onClickSendDm = (ev: ButtonEvent): void => {
    PosthogTrackers.trackInteraction("WebHomeCreateChatButton", ev);
    dis.dispatch({ action: Action.CreateChat });
};

const onClickNewRoom = (ev: ButtonEvent): void => {
    PosthogTrackers.trackInteraction("WebHomeCreateRoomButton", ev);
    dis.dispatch({ action: Action.CreateRoom });
};

interface IProps {
    justRegistered?: boolean;
}

const getOwnProfile = (userId: string): { displayName: string } => ({
    displayName: OwnProfileStore.instance.displayName || userId,
});

const FioHome: React.FC = () => {
    const cli = useMatrixClientContext();
    const userId = cli.getUserId()!;
    const [ownProfile, setOwnProfile] = useState(getOwnProfile(userId));

    useEventEmitter(OwnProfileStore.instance, UPDATE_EVENT, () => {
        setOwnProfile(getOwnProfile(userId));
    });

    return (
        <div className="fio_Home">
            <header className="fio_HomeHeader">
                <span className="fio_HomeMark">[ fio ]</span>
                <span className="fio_HomeLine" aria-hidden="true" />
                <span className="fio_HomeStatus">pulso · comunicação soberana</span>
            </header>

            <section className="fio_HomeBody">
                <div className="fio_HomeIdentity">
                    <span className="fio_HomeEyebrow">[ início ]</span>
                    <h1>o fio começa aqui.</h1>
                    <p>
                        Uma casa de conversa para a família — conectada quando precisa,
                        <br /> soberana sempre.
                    </p>
                </div>

                <div className="fio_HomeActions" aria-label="Começar no FIO">
                    <AccessibleButton onClick={onClickSendDm} className="fio_HomeAction fio_HomeAction--primary">
                        <span className="fio_HomeActionGlyph" aria-hidden="true">
                            ○
                        </span>
                        <span>
                            <strong>novo fio</strong>
                            <small>conversa entre pessoas</small>
                        </span>
                        <span className="fio_HomeActionArrow" aria-hidden="true">
                            →
                        </span>
                    </AccessibleButton>
                    <AccessibleButton onClick={onClickNewRoom} className="fio_HomeAction">
                        <span className="fio_HomeActionGlyph" aria-hidden="true">
                            ＋
                        </span>
                        <span>
                            <strong>novo círculo</strong>
                            <small>um espaço compartilhado</small>
                        </span>
                        <span className="fio_HomeActionArrow" aria-hidden="true">
                            →
                        </span>
                    </AccessibleButton>
                </div>
            </section>

            <footer className="fio_HomeFooter">
                <span>{ownProfile.displayName}</span>
                <span>cada círculo define quem atravessa o limiar</span>
            </footer>
        </div>
    );
};

const HomePage: React.FC<IProps> = () => {
    const cli = useMatrixClientContext();
    const config = SdkConfig.get();
    const pageUrl = getHomePageUrl(config, cli);

    if (pageUrl) {
        return <EmbeddedPage className="mx_HomePage" url={pageUrl} scrollbar={true} />;
    }

    return (
        <AutoHideScrollbar className="mx_AutoHideScrollbar mx_HomePage mx_HomePage_default" as="main">
            <FioHome />
        </AutoHideScrollbar>
    );
};

export default HomePage;
